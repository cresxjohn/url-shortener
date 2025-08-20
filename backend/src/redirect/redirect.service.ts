import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class RedirectService {
  constructor(
    private prisma: PrismaService,
    private analyticsService: AnalyticsService
  ) {}

  async redirect(shortCode: string, request: any) {
    // Find the URL
    const url = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (!url.isActive) {
      throw new NotFoundException('URL has been deactivated');
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new NotFoundException('URL has expired');
    }

    // Track the click asynchronously
    this.trackClick(url.id, request).catch(console.error);

    // Increment click count
    this.incrementClickCount(shortCode).catch(console.error);

    return url.longUrl;
  }

  private async trackClick(urlId: string, request: any) {
    try {
      await this.analyticsService.trackClick(urlId, {
        ipAddress: this.getIpAddress(request),
        userAgent: request.headers['user-agent'],
        referrer: request.headers.referer || request.headers.referrer,
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  private async incrementClickCount(shortCode: string) {
    try {
      await this.prisma.url.update({
        where: { shortCode },
        data: {
          clicks: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  }

  private getIpAddress(request: any): string {
    return (
      request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      'unknown'
    );
  }
}
