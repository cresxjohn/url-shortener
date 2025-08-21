import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { AnalyticsService } from '@/lib/services/analytics';

interface Context {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    // Get authenticated user
    let user;
    try {
      user = getAuthenticatedUser(request);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // In Next.js 14+, params is a Promise
    const resolvedParams = await params;

    const analyticsService = new AnalyticsService();

    try {
      const stats = await analyticsService.getUrlStats(
        resolvedParams.id,
        user.id
      );

      return NextResponse.json({
        url: {
          id: stats.url._id.toString(),
          shortCode: stats.url.shortCode,
          longUrl: stats.url.longUrl,
          title: stats.url.title,
          description: stats.url.description,
          isActive: stats.url.isActive,
          clicks: stats.url.clicks,
          expiresAt: stats.url.expiresAt?.toISOString(),
          userId: stats.url.userId?.toString(),
          createdAt: stats.url.createdAt.toISOString(),
          updatedAt: stats.url.updatedAt.toISOString(),
        },
        totalClicks: stats.totalClicks,
        uniqueClicks: stats.uniqueClicks,
        clicksByDay: stats.clicksByDay,
        clicksByCountry: stats.clicksByCountry,
        clicksByDevice: stats.clicksByDevice,
        clicksByBrowser: stats.clicksByBrowser,
        clicksByReferrer: stats.clicksByReferrer,
        recentClicks: stats.recentClicks.map((click: any) => ({
          id: click._id.toString(),
          timestamp: click.timestamp.toISOString(),
          ipAddress: click.ipAddress,
          userAgent: click.userAgent,
          referrer: click.referrer,
          country: click.country,
          city: click.city,
          device: click.device,
          browser: click.browser,
          os: click.os,
          urlId: click.urlId.toString(),
        })),
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'URL not found') {
          return NextResponse.json(
            { message: 'URL not found' },
            { status: 404 }
          );
        }
        if (error.message === 'You can only view analytics for your own URLs') {
          return NextResponse.json(
            { message: 'You can only view analytics for your own URLs' },
            { status: 403 }
          );
        }
      }
      throw error;
    }
  } catch (error) {
    console.error('Get URL analytics error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
