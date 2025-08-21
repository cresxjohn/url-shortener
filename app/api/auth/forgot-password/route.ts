import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { sendPasswordResetEmail } from '@/lib/services/email';
import { rateLimiters } from '@/lib/middleware/rateLimit';
import { SecurityLogger } from '@/lib/security/auditLog';

export async function POST(request: NextRequest) {
  const ipAddress =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    await connectDB();

    // Apply strict rate limiting for password reset
    const rateLimit = rateLimiters.passwordReset(request);
    if (!rateLimit.allowed) {
      await SecurityLogger.logRateLimitViolation(
        'POST /api/auth/forgot-password',
        {
          ipAddress,
          userAgent,
          limit: 3,
          current: rateLimit.remaining,
        }
      );

      return NextResponse.json(
        {
          message: 'Too many password reset attempts. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '3600',
          },
        }
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Always respond with success to prevent email enumeration
    const genericResponse = NextResponse.json(
      { message: 'If an account exists, a reset link has been sent.' },
      { status: 200 }
    );

    if (!user) {
      return genericResponse;
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiryMs = 60 * 60 * 1000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + expiryMs);
    await user.save();

    // Use request origin to build reset URL
    const origin = request.nextUrl.origin;
    const resetUrl = `${origin}/reset-password?token=${encodeURIComponent(resetToken)}`;
    await sendPasswordResetEmail(normalizedEmail, resetUrl, origin);

    // Note: Do not expose devResetUrl in real production responses.
    return NextResponse.json(
      {
        message: 'If an account exists, a reset link has been sent.',
        devResetUrl:
          process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
