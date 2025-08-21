import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/lib/models/Url';
import { AnalyticsService } from './analytics';

export class RedirectService {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  async redirect(shortCode: string, request: NextRequest) {
    await connectDB();

    // Find the URL
    const url = await Url.findOne({ shortCode });

    if (!url) {
      throw new Error('URL not found');
    }

    if (!url.isActive) {
      throw new Error('URL has been deactivated');
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new Error('URL has expired');
    }

    // Track the click asynchronously
    this.trackClick(url._id.toString(), request).catch(console.error);

    // Increment click count asynchronously
    this.incrementClickCount(shortCode).catch(console.error);

    return url.longUrl;
  }

  private async trackClick(urlId: string, request: NextRequest) {
    try {
      await this.analyticsService.trackClick(urlId, {
        ipAddress: this.getIpAddress(request),
        userAgent: request.headers.get('user-agent') || undefined,
        referrer: request.headers.get('referer') || request.headers.get('referrer') || undefined,
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  private async incrementClickCount(shortCode: string) {
    try {
      await Url.findOneAndUpdate(
        { shortCode },
        { $inc: { clicks: 1 } }
      );
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  }

  private getIpAddress(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIp) {
      return realIp;
    }
    
    return 'unknown';
  }
}
