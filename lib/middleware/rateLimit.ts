import { NextRequest } from 'next/server';

interface RateLimit {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, RateLimit>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig) {
  return (request: NextRequest): RateLimitResult => {
    const now = Date.now();
    const key = config.keyGenerator
      ? config.keyGenerator(request)
      : getClientIP(request);

    // Clean up expired entries
    cleanupExpired();

    const currentLimit = rateLimitStore.get(key);

    if (!currentLimit || now > currentLimit.resetTime) {
      // First request or window expired
      const resetTime = now + config.windowMs;
      rateLimitStore.set(key, {
        count: 1,
        resetTime,
      });

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime,
      };
    }

    if (currentLimit.count >= config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: currentLimit.resetTime,
        retryAfter: Math.ceil((currentLimit.resetTime - now) / 1000),
      };
    }

    // Increment counter
    currentLimit.count++;
    rateLimitStore.set(key, currentLimit);

    return {
      allowed: true,
      remaining: config.maxRequests - currentLimit.count,
      resetTime: currentLimit.resetTime,
    };
  };
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('x-vercel-forwarded-for');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (remoteAddr) {
    return remoteAddr.split(',')[0].trim();
  }

  return 'unknown';
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpired(): void {
  const now = Date.now();

  // Convert to array to avoid iterator issues
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, limit] of entries) {
    if (now > limit.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Predefined rate limiters
 */
export const rateLimiters = {
  // General API endpoints - generous for free usage
  api: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000, // Increased from 100
  }),

  // URL creation (generous but prevents attacks)
  urlCreation: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 30, // 30 URLs per minute max
  }),

  // Anonymous URL creation (still need some limits)
  anonymousUrlCreation: rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 50, // Increased from 3 to 50
  }),

  // Auth endpoints (keep secure)
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // Increased slightly
  }),

  // Password reset (keep secure)
  passwordReset: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // Keep strict for security
  }),
};
