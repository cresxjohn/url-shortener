import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { AnalyticsService } from '@/lib/services/analytics';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    let user;
    try {
      user = getAuthenticatedUser(request);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const analyticsService = new AnalyticsService();
    const stats = await analyticsService.getUserStats(user.id);

    return NextResponse.json({
      totalUrls: stats.totalUrls,
      totalClicks: stats.totalClicks,
      recentClicks: stats.recentClicks,
      topUrls: stats.topUrls.map(url => ({
        id: url._id.toString(),
        shortCode: url.shortCode,
        clicks: url.clicks,
      })),
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
