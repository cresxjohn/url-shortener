import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as UAParser from 'ua-parser-js';

interface ClickData {
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackClick(urlId: string, clickData: ClickData) {
    const parser = new UAParser(clickData.userAgent);
    const result = parser.getResult();

    // In a real app, you'd use a geolocation service to get country/city from IP
    const country = await this.getCountryFromIp(clickData.ipAddress);
    const city = await this.getCityFromIp(clickData.ipAddress);

    return this.prisma.click.create({
      data: {
        urlId,
        ipAddress: clickData.ipAddress,
        userAgent: clickData.userAgent,
        referrer: clickData.referrer,
        country,
        city,
        device: result.device.type || 'desktop',
        browser: result.browser.name,
        os: result.os.name,
      },
    });
  }

  async getUrlStats(urlId: string, userId: string) {
    // First, verify that the URL belongs to the user
    const url = await this.prisma.url.findUnique({
      where: { id: urlId },
      select: { userId: true },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException(
        'You can only view analytics for your own URLs'
      );
    }

    const [
      totalClicks,
      clicksByDay,
      clicksByCountry,
      clicksByDevice,
      clicksByBrowser,
      clicksByReferrer,
    ] = await Promise.all([
      this.getTotalClicks(urlId),
      this.getClicksByDay(urlId),
      this.getClicksByCountry(urlId),
      this.getClicksByDevice(urlId),
      this.getClicksByBrowser(urlId),
      this.getClicksByReferrer(urlId),
    ]);

    return {
      totalClicks,
      clicksByDay,
      clicksByCountry,
      clicksByDevice,
      clicksByBrowser,
      clicksByReferrer,
    };
  }

  async getUserStats(userId: string) {
    const urls = await this.prisma.url.findMany({
      where: { userId },
      select: { id: true, shortCode: true, clicks: true },
    });

    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

    const recentClicks = await this.prisma.click.findMany({
      where: {
        url: { userId },
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    return {
      totalUrls,
      totalClicks,
      recentClicks: recentClicks.length,
      topUrls: urls.sort((a, b) => b.clicks - a.clicks).slice(0, 5),
    };
  }

  private async getTotalClicks(urlId: string) {
    return this.prisma.click.count({
      where: { urlId },
    });
  }

  private async getClicksByDay(urlId: string, days = 30) {
    const result = await this.prisma.click.groupBy({
      by: ['timestamp'],
      where: {
        urlId,
        timestamp: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      _count: {
        id: true,
      },
    });

    // Group by day
    const clicksByDay = result.reduce((acc, click) => {
      const day = click.timestamp.toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + click._count.id;
      return acc;
    }, {});

    return clicksByDay;
  }

  private async getClicksByCountry(urlId: string) {
    return this.prisma.click.groupBy({
      by: ['country'],
      where: { urlId },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });
  }

  private async getClicksByDevice(urlId: string) {
    return this.prisma.click.groupBy({
      by: ['device'],
      where: { urlId },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });
  }

  private async getClicksByBrowser(urlId: string) {
    return this.prisma.click.groupBy({
      by: ['browser'],
      where: { urlId },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });
  }

  private async getClicksByReferrer(urlId: string) {
    return this.prisma.click.groupBy({
      by: ['referrer'],
      where: {
        urlId,
        referrer: {
          not: null,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });
  }

  private async getCountryFromIp(ipAddress?: string): Promise<string | null> {
    // In a real implementation, use a geolocation service like:
    // - MaxMind GeoLite2
    // - ipapi.co
    // - ip-api.com
    return ipAddress ? 'Unknown' : null;
  }

  private async getCityFromIp(ipAddress?: string): Promise<string | null> {
    // In a real implementation, use a geolocation service
    return ipAddress ? 'Unknown' : null;
  }
}
