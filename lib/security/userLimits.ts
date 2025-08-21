interface UserConfig {
  name: string;
  customSlugAllowed: boolean;
  analyticsRetention: number; // days
  maxUrlLength: number;
  canSetExpiration: boolean;
}

/**
 * User configuration - free for all users
 */
export const USER_CONFIG: UserConfig = {
  name: 'Free',
  customSlugAllowed: true,
  analyticsRetention: 365, // 1 year retention for everyone
  maxUrlLength: 2048,
  canSetExpiration: true,
};

export interface UsageLimitResult {
  allowed: boolean;
  reason?: string;
  current: number;
  limit: number;
  resetsAt?: Date;
}

/**
 * User configuration management - free for all users
 */
export class UserConfigManager {
  /**
   * Check if user can use custom slugs (always true)
   */
  static canUseCustomSlug(): boolean {
    return USER_CONFIG.customSlugAllowed;
  }

  /**
   * Check if user can set expiration (always true)
   */
  static canSetExpiration(): boolean {
    return USER_CONFIG.canSetExpiration;
  }

  /**
   * Get maximum URL length
   */
  static getMaxUrlLength(): number {
    return USER_CONFIG.maxUrlLength;
  }

  /**
   * Get analytics retention period
   */
  static getAnalyticsRetention(): number {
    return USER_CONFIG.analyticsRetention;
  }

  /**
   * Check for suspicious user activity (anti-abuse)
   */
  static async checkSuspiciousActivity(
    userId: string | null
  ): Promise<boolean> {
    if (!userId) return false;

    const Url = (await import('../models/Url')).default;

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Check for extremely rapid URL creation (more than 20 in 5 minutes)
    const rapidUrls = await Url.countDocuments({
      userId: userId,
      createdAt: { $gte: fiveMinutesAgo },
    });

    if (rapidUrls > 20) {
      return true; // Potential bot/attack
    }

    // Check for burst activity with timing patterns
    const recentUrls = await Url.find({
      userId: userId,
      createdAt: { $gte: oneHourAgo },
    }).sort({ createdAt: 1 });

    if (recentUrls.length > 50) {
      // Check if created too quickly (less than 3 seconds apart consistently)
      let fastCreations = 0;
      for (let i = 1; i < recentUrls.length; i++) {
        const timeDiff =
          recentUrls[i].createdAt.getTime() -
          recentUrls[i - 1].createdAt.getTime();
        if (timeDiff < 3000) {
          // Less than 3 seconds
          fastCreations++;
        }
      }

      // If more than 80% of URLs were created within 3 seconds of each other
      if (fastCreations / recentUrls.length > 0.8) {
        return true; // Likely automated
      }
    }

    return false;
  }
}

/**
 * IP-based limits for anonymous users
 */
export class IPLimitsManager {
  private static ipLimits = new Map<
    string,
    { count: number; resetTime: number }
  >();

  /**
   * Check IP-based limits for anonymous users (anti-abuse only)
   */
  static checkIPLimit(ip: string): UsageLimitResult {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour window
    const maxRequests = 200; // 200 URLs per hour per IP (generous but prevents attacks)

    // Clean up expired entries
    this.cleanupExpired();

    const current = this.ipLimits.get(ip);

    if (!current || now > current.resetTime) {
      // First request or window expired
      const resetTime = now + windowMs;
      this.ipLimits.set(ip, { count: 1, resetTime });

      return {
        allowed: true,
        current: 1,
        limit: maxRequests,
        resetsAt: new Date(resetTime),
      };
    }

    if (current.count >= maxRequests) {
      return {
        allowed: false,
        reason:
          'Hourly IP limit exceeded - please wait or sign up for an account',
        current: current.count,
        limit: maxRequests,
        resetsAt: new Date(current.resetTime),
      };
    }

    current.count++;
    this.ipLimits.set(ip, current);

    return {
      allowed: true,
      current: current.count,
      limit: maxRequests,
    };
  }

  /**
   * Clean up expired IP limit entries
   */
  private static cleanupExpired(): void {
    const now = Date.now();

    for (const [ip, limit] of this.ipLimits.entries()) {
      if (now > limit.resetTime) {
        this.ipLimits.delete(ip);
      }
    }
  }
}
