import { UAParser } from 'ua-parser-js';
import connectDB from '@/lib/mongodb';
import Click from '@/lib/models/Click';
import Url from '@/lib/models/Url';

interface ClickData {
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export class AnalyticsService {
  async trackClick(urlId: string, clickData: ClickData) {
    await connectDB();

    const parser = new UAParser(clickData.userAgent);
    const result = parser.getResult();

    // In a real app, you'd use a geolocation service to get country/city from IP
    const country = await this.getCountryFromIp(clickData.ipAddress);
    const city = await this.getCityFromIp(clickData.ipAddress);

    return Click.create({
      urlId,
      ipAddress: clickData.ipAddress,
      userAgent: clickData.userAgent,
      referrer: clickData.referrer,
      country,
      city,
      device: result.device.type || 'desktop',
      browser: result.browser.name,
      os: result.os.name,
    });
  }

  async getUrlStats(urlId: string, userId: string) {
    await connectDB();

    // First, verify that the URL belongs to the user
    const url = await Url.findById(urlId).select('userId');
    if (!url) {
      throw new Error('URL not found');
    }

    if (url.userId?.toString() !== userId) {
      throw new Error('You can only view analytics for your own URLs');
    }

    const [
      totalClicks,
      uniqueClicks,
      clicksByDay,
      clicksByCountry,
      clicksByDevice,
      clicksByBrowser,
      clicksByReferrer,
      recentClicks,
    ] = await Promise.all([
      this.getTotalClicks(urlId),
      this.getUniqueClicks(urlId),
      this.getClicksByDay(urlId),
      this.getClicksByCountry(urlId),
      this.getClicksByDevice(urlId),
      this.getClicksByBrowser(urlId),
      this.getClicksByReferrer(urlId),
      this.getRecentClicks(urlId),
    ]);

    return {
      url: await Url.findById(urlId),
      totalClicks,
      uniqueClicks,
      clicksByDay: clicksByDay,
      clicksByCountry,
      clicksByDevice,
      clicksByBrowser,
      clicksByReferrer,
      recentClicks,
    };
  }

  async getUserStats(userId: string) {
    await connectDB();

    const urls = await Url.find({ userId }).select('_id shortCode clicks');

    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

    const recentClicks = await Click.find({
      urlId: { $in: urls.map((url) => url._id) },
      timestamp: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    })
      .sort({ timestamp: -1 })
      .limit(100);

    return {
      totalUrls,
      totalClicks,
      recentClicks: recentClicks.length,
      topUrls: urls.sort((a, b) => b.clicks - a.clicks).slice(0, 5),
    };
  }

  private async getTotalClicks(urlId: string) {
    return Click.countDocuments({ urlId });
  }

  private async getUniqueClicks(urlId: string) {
    const uniqueIps = await Click.distinct('ipAddress', { urlId });
    return uniqueIps.filter((ip) => ip && ip !== 'unknown').length;
  }

  private async getClicksByDay(urlId: string, days = 30) {
    const pipeline = [
      {
        $match: {
          urlId: urlId,
          timestamp: {
            $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp',
            },
          },
          clicks: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 as const },
      },
    ];

    const result = await Click.aggregate(pipeline);
    return result.map((item) => ({
      date: item._id,
      clicks: item.clicks,
    }));
  }

  private async getClicksByCountry(urlId: string) {
    const pipeline = [
      {
        $match: { urlId, country: { $ne: null } },
      },
      {
        $group: {
          _id: '$country',
          clicks: { $sum: 1 },
        },
      },
      {
        $sort: { clicks: -1 as const },
      },
      {
        $limit: 10,
      },
    ];

    const result = await Click.aggregate(pipeline);
    return result.map((item) => ({
      country: item._id,
      _count: { id: item.clicks },
    }));
  }

  private async getClicksByDevice(urlId: string) {
    const pipeline = [
      {
        $match: { urlId },
      },
      {
        $group: {
          _id: '$device',
          clicks: { $sum: 1 },
        },
      },
      {
        $sort: { clicks: -1 as const },
      },
    ];

    const result = await Click.aggregate(pipeline);
    return result.map((item) => ({
      device: item._id,
      _count: { id: item.clicks },
    }));
  }

  private async getClicksByBrowser(urlId: string) {
    const pipeline = [
      {
        $match: { urlId, browser: { $ne: null } },
      },
      {
        $group: {
          _id: '$browser',
          clicks: { $sum: 1 },
        },
      },
      {
        $sort: { clicks: -1 as const },
      },
      {
        $limit: 10,
      },
    ];

    const result = await Click.aggregate(pipeline);
    return result.map((item) => ({
      browser: item._id,
      _count: { id: item.clicks },
    }));
  }

  private async getClicksByReferrer(urlId: string) {
    const pipeline = [
      {
        $match: {
          urlId,
          referrer: { $nin: [null, ''] },
        },
      },
      {
        $group: {
          _id: '$referrer',
          clicks: { $sum: 1 },
        },
      },
      {
        $sort: { clicks: -1 as const },
      },
      {
        $limit: 10,
      },
    ];

    const result = await Click.aggregate(pipeline);
    return result.map((item) => ({
      referrer: item._id,
      _count: { id: item.clicks },
    }));
  }

  private async getRecentClicks(urlId: string) {
    return Click.find({ urlId }).sort({ timestamp: -1 }).limit(50).lean();
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
