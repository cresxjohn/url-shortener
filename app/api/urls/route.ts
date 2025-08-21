import { extractTokenFromRequest, getAuthenticatedUser } from '@/lib/auth';
import { rateLimiters } from '@/lib/middleware/rateLimit';
import Url from '@/lib/models/Url';
import connectDB from '@/lib/mongodb';
import { SecurityLogger } from '@/lib/security/auditLog';
import { SpamDetector, URLValidator } from '@/lib/security/urlValidator';
import { IPLimitsManager, UserConfigManager } from '@/lib/security/userLimits';
import { CreateUrlDto } from '@/lib/types';
import {
  extractDescription,
  extractTitle,
  generateUniqueShortCode,
  validateSlug,
} from '@/lib/utils/url';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | null = null;
  let user: any = null;

  // Extract request context for logging
  const ipAddress =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    await connectDB();

    // Check if user is authenticated (optional for this endpoint)
    const token = extractTokenFromRequest(request);
    if (token) {
      try {
        user = getAuthenticatedUser(request);
        userId = user.id;
      } catch (error) {
        // Token invalid, continue as anonymous
      }
    }

    // Apply rate limiting
    const rateLimiter = userId
      ? rateLimiters.urlCreation
      : rateLimiters.anonymousUrlCreation;
    const rateLimit = rateLimiter(request);

    if (!rateLimit.allowed) {
      await SecurityLogger.logRateLimitViolation('POST /api/urls', {
        userId: userId || undefined,
        ipAddress,
        userAgent,
        limit: userId ? 30 : 50, // Authenticated vs anonymous limits
        current: rateLimit.remaining,
      });

      return NextResponse.json(
        {
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '60',
          },
        }
      );
    }

    const body: CreateUrlDto = await request.json();
    const { longUrl, customSlug, expiresAt } = body;

    // Enhanced URL validation
    const urlValidation = await URLValidator.validateURL(longUrl);
    if (!urlValidation.isValid) {
      await SecurityLogger.logBlockedUrl(
        longUrl,
        urlValidation.reason || 'Invalid URL',
        {
          userId: userId || undefined,
          ipAddress,
          userAgent,
        }
      );

      return NextResponse.json(
        { message: urlValidation.reason || 'Invalid URL' },
        { status: 400 }
      );
    }

    // No user quotas - app is free to use!

    // Check for anonymous IP limits
    if (!userId) {
      const ipLimit = IPLimitsManager.checkIPLimit(ipAddress);
      if (!ipLimit.allowed) {
        await SecurityLogger.logEvent(
          'ip_limit_exceeded',
          'medium',
          {
            reason: ipLimit.reason,
            current: ipLimit.current,
            limit: ipLimit.limit,
          },
          { ipAddress, userAgent, tags: ['ip_limits'] }
        );

        return NextResponse.json({ message: ipLimit.reason }, { status: 429 });
      }
    }

    // Check for spam behavior
    const isSpam = await SpamDetector.checkSpamBehavior(userId, longUrl);
    if (isSpam) {
      await SecurityLogger.logSuspiciousActivity(
        'spam_detected',
        {
          longUrl,
          pattern: 'excessive_url_creation',
        },
        { userId: userId || undefined, ipAddress, userAgent }
      );

      return NextResponse.json(
        { message: 'Suspicious activity detected. Please contact support.' },
        { status: 403 }
      );
    }

    // Check suspicious user activity
    if (userId && (await UserConfigManager.checkSuspiciousActivity(userId))) {
      await SecurityLogger.logSuspiciousActivity(
        'burst_activity',
        {
          longUrl,
        },
        { userId: userId || undefined, ipAddress, userAgent }
      );

      return NextResponse.json(
        { message: 'Please slow down your requests.' },
        { status: 429 }
      );
    }

    // Validate URL length (reasonable limit to prevent abuse)
    const maxLength = UserConfigManager.getMaxUrlLength();
    if (longUrl.length > maxLength) {
      return NextResponse.json(
        { message: `URL exceeds maximum length of ${maxLength} characters` },
        { status: 400 }
      );
    }

    // Generate or use custom short code
    let shortCode: string;
    if (customSlug) {
      try {
        await validateSlug(customSlug);
        shortCode = customSlug;
      } catch (error) {
        return NextResponse.json(
          {
            message:
              error instanceof Error ? error.message : 'Invalid custom slug',
          },
          { status: 400 }
        );
      }
    } else {
      try {
        shortCode = await generateUniqueShortCode();
      } catch (error) {
        return NextResponse.json(
          { message: 'Failed to generate unique short code' },
          { status: 500 }
        );
      }
    }

    // Extract title and description
    const title = await extractTitle(longUrl);
    const description = await extractDescription(longUrl);

    // Create URL
    const url = await Url.create({
      shortCode,
      longUrl,
      title,
      description,
      userId,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    // Log successful URL creation
    await SecurityLogger.logUrlCreation(true, {
      longUrl,
      shortCode,
      userId: userId || undefined,
      ipAddress,
      userAgent,
    });

    // Log performance metrics
    const processingTime = Date.now() - startTime;
    console.log(`URL created successfully in ${processingTime}ms`, {
      shortCode,
      userId: userId || 'anonymous',
      processingTime,
    });

    return NextResponse.json(
      {
        id: url._id.toString(),
        shortCode: url.shortCode,
        longUrl: url.longUrl,
        title: url.title,
        description: url.description,
        customSlug: url.customSlug,
        isActive: url.isActive,
        clicks: url.clicks,
        expiresAt: url.expiresAt?.toISOString(),
        userId: url.userId?.toString(),
        createdAt: url.createdAt.toISOString(),
        updatedAt: url.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create URL error:', error);

    // Log error for security monitoring
    await SecurityLogger.logEvent(
      'url_creation_error',
      'high',
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { userId: userId || undefined, ipAddress, userAgent, tags: ['error'] }
    );

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get authenticated user
    let user;
    try {
      user = getAuthenticatedUser(request);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get user URLs with pagination
    const [urls, total] = await Promise.all([
      Url.find({ userId: user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Url.countDocuments({ userId: user.id }),
    ]);

    return NextResponse.json({
      urls: urls.map((url: any) => ({
        id: url._id.toString(),
        shortCode: url.shortCode,
        longUrl: url.longUrl,
        title: url.title,
        description: url.description,
        customSlug: url.customSlug,
        isActive: url.isActive,
        clicks: url.clicks,
        expiresAt: url.expiresAt?.toISOString(),
        userId: url.userId?.toString(),
        createdAt: url.createdAt.toISOString(),
        updatedAt: url.updatedAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get user URLs error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
