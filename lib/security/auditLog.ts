import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  timestamp: Date;
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details: any;
  tags: string[];
}

const auditLogSchema = new Schema<IAuditLog>({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  event: {
    type: String,
    required: true,
    index: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
    index: true,
  },
  userId: {
    type: String,
    index: true,
  },
  ipAddress: {
    type: String,
    index: true,
  },
  userAgent: {
    type: String,
  },
  details: {
    type: Schema.Types.Mixed,
  },
  tags: [
    {
      type: String,
      index: true,
    },
  ],
});

// TTL index to automatically delete old logs (keep for 90 days)
auditLogSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }
);

export const AuditLog =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

/**
 * Security event logger
 */
export class SecurityLogger {
  /**
   * Log a security event
   */
  static async logEvent(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: any,
    context?: {
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
      tags?: string[];
    }
  ): Promise<void> {
    try {
      await AuditLog.create({
        event,
        severity,
        details,
        userId: context?.userId,
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
        tags: context?.tags || [],
      });

      // In production, also send to external monitoring
      if (severity === 'critical') {
        console.error('CRITICAL SECURITY EVENT:', { event, details, context });
        // Send alert to monitoring system (e.g., Datadog, New Relic, etc.)
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  /**
   * Log URL creation attempt
   */
  static async logUrlCreation(
    success: boolean,
    details: {
      longUrl: string;
      shortCode?: string;
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
      reason?: string;
    }
  ): Promise<void> {
    await this.logEvent(
      success ? 'url_created' : 'url_creation_failed',
      success ? 'low' : 'medium',
      {
        longUrl: details.longUrl,
        shortCode: details.shortCode,
        reason: details.reason,
      },
      {
        userId: details.userId,
        ipAddress: details.ipAddress,
        userAgent: details.userAgent,
        tags: ['url_creation'],
      }
    );
  }

  /**
   * Log rate limit violation
   */
  static async logRateLimitViolation(
    endpoint: string,
    context: {
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
      limit: number;
      current: number;
    }
  ): Promise<void> {
    await this.logEvent(
      'rate_limit_exceeded',
      'medium',
      {
        endpoint,
        limit: context.limit,
        current: context.current,
      },
      {
        userId: context.userId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        tags: ['rate_limit', 'abuse'],
      }
    );
  }

  /**
   * Log suspicious activity
   */
  static async logSuspiciousActivity(
    activity: string,
    details: any,
    context: {
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    await this.logEvent(
      'suspicious_activity',
      'high',
      { activity, ...details },
      {
        userId: context.userId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        tags: ['suspicious', 'abuse'],
      }
    );
  }

  /**
   * Log blocked URL attempt
   */
  static async logBlockedUrl(
    url: string,
    reason: string,
    context: {
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    await this.logEvent(
      'url_blocked',
      'high',
      { url, reason },
      {
        userId: context.userId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        tags: ['blocked_url', 'security'],
      }
    );
  }

  /**
   * Log authentication events
   */
  static async logAuthEvent(
    event: 'login' | 'logout' | 'signup' | 'password_reset' | 'failed_login',
    success: boolean,
    context: {
      userId?: string;
      email?: string;
      ipAddress?: string;
      userAgent?: string;
      reason?: string;
    }
  ): Promise<void> {
    const severity = event === 'failed_login' && !success ? 'medium' : 'low';

    await this.logEvent(
      `auth_${event}`,
      severity,
      {
        success,
        email: context.email,
        reason: context.reason,
      },
      {
        userId: context.userId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        tags: ['auth', event],
      }
    );
  }

  /**
   * Get recent security events for monitoring
   */
  static async getRecentEvents(
    filters?: {
      severity?: string;
      event?: string;
      userId?: string;
      ipAddress?: string;
      since?: Date;
      tags?: string[];
    },
    limit: number = 100
  ): Promise<IAuditLog[]> {
    const query: any = {};

    if (filters?.severity) query.severity = filters.severity;
    if (filters?.event) query.event = filters.event;
    if (filters?.userId) query.userId = filters.userId;
    if (filters?.ipAddress) query.ipAddress = filters.ipAddress;
    if (filters?.since) query.timestamp = { $gte: filters.since };
    if (filters?.tags?.length) query.tags = { $in: filters.tags };

    return AuditLog.find(query).sort({ timestamp: -1 }).limit(limit).lean();
  }

  /**
   * Get abuse statistics
   */
  static async getAbuseStats(
    timeframe: 'hour' | 'day' | 'week' = 'day'
  ): Promise<any> {
    const now = new Date();
    let since: Date;

    switch (timeframe) {
      case 'hour':
        since = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'week':
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const stats = await AuditLog.aggregate([
      {
        $match: {
          timestamp: { $gte: since },
          tags: { $in: ['abuse', 'suspicious', 'rate_limit'] },
        },
      },
      {
        $group: {
          _id: {
            event: '$event',
            severity: '$severity',
          },
          count: { $sum: 1 },
          uniqueIPs: { $addToSet: '$ipAddress' },
          uniqueUsers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          event: '$_id.event',
          severity: '$_id.severity',
          count: 1,
          uniqueIPCount: { $size: '$uniqueIPs' },
          uniqueUserCount: { $size: '$uniqueUsers' },
          _id: 0,
        },
      },
    ]);

    return stats;
  }
}
