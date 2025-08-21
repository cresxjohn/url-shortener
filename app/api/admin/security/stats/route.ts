import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { SecurityLogger } from '@/lib/security/auditLog';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Check if user is authenticated and is admin
    let user;
    try {
      user = getAuthenticatedUser(request);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // In a real implementation, check if user has admin role
    // For now, this is just a placeholder endpoint

    const searchParams = request.nextUrl.searchParams;
    const timeframe =
      (searchParams.get('timeframe') as 'hour' | 'day' | 'week') || 'day';

    // Get abuse statistics
    const abuseStats = await SecurityLogger.getAbuseStats(timeframe);

    // Get recent high-severity events
    const recentEvents = await SecurityLogger.getRecentEvents(
      {
        severity: 'high',
        since: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
      50
    );

    // Get rate limit violations
    const rateLimitEvents = await SecurityLogger.getRecentEvents(
      {
        tags: ['rate_limit'],
        since: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
      20
    );

    return NextResponse.json({
      timeframe,
      abuseStats,
      recentEvents: recentEvents.map((event) => ({
        timestamp: event.timestamp,
        event: event.event,
        severity: event.severity,
        details: event.details,
        ipAddress: event.ipAddress,
        userId: event.userId,
        tags: event.tags,
      })),
      rateLimitEvents: rateLimitEvents.map((event) => ({
        timestamp: event.timestamp,
        event: event.event,
        ipAddress: event.ipAddress,
        details: event.details,
      })),
    });
  } catch (error) {
    console.error('Get security stats error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
