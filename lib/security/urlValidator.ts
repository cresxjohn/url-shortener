import { URL } from 'url';
import BlacklistedUrl from '../models/BlacklistedUrl';

export interface URLValidationResult {
  isValid: boolean;
  reason?: string;
  risk?: 'low' | 'medium' | 'high';
}

/**
 * Comprehensive URL validation and security checking
 */
export class URLValidator {
  // Suspicious URL patterns
  private static suspiciousPatterns = [
    // Shortened URLs (prevent shortener loops)
    /bit\.ly|tinyurl|t\.co|goo\.gl|short\.link|ow\.ly|is\.gd|buff\.ly/i,

    // Common malicious patterns
    /phishing|malware|virus|hack|crack|porn|adult|gambling/i,

    // Suspicious TLDs
    /\.(tk|ml|ga|cf|click|download|zip|exe)$/i,

    // Suspicious subdomains
    /^(secure|login|verify|update|account|support|admin)[\.-]/i,

    // IP addresses (often suspicious)
    /^https?:\/\/\d+\.\d+\.\d+\.\d+/,

    // Suspicious query parameters
    /[?&](download|install|exec|run|cmd)=/i,
  ];

  // Known malicious domains (sample list)
  private static maliciousDomains = new Set([
    'bit.ly', // Prevent shortener chains
    'tinyurl.com',
    'goo.gl',
    't.co',
    'ow.ly',
    'is.gd',
    'buff.ly',
  ]);

  // Safe domains (big tech, news, etc.)
  private static safeDomains = new Set([
    'google.com',
    'youtube.com',
    'facebook.com',
    'twitter.com',
    'instagram.com',
    'linkedin.com',
    'github.com',
    'stackoverflow.com',
    'wikipedia.org',
    'nytimes.com',
    'bbc.com',
    'cnn.com',
    'reddit.com',
    'amazon.com',
    'microsoft.com',
    'apple.com',
  ]);

  /**
   * Validate URL for security and policy compliance
   */
  static async validateURL(urlString: string): Promise<URLValidationResult> {
    try {
      // Basic URL validation
      const url = new URL(urlString);

      // Check protocol
      if (!['http:', 'https:'].includes(url.protocol)) {
        return {
          isValid: false,
          reason: 'Only HTTP and HTTPS URLs are allowed',
          risk: 'high',
        };
      }

      // Check for localhost/internal IPs
      if (this.isLocalOrPrivateIP(url.hostname)) {
        return {
          isValid: false,
          reason: 'Local and private network URLs are not allowed',
          risk: 'high',
        };
      }

      // Check blacklist
      const blacklistResult = await this.checkBlacklist(urlString);
      if (!blacklistResult.isValid) {
        return blacklistResult;
      }

      // Check for suspicious patterns
      const patternResult = this.checkSuspiciousPatterns(urlString);
      if (!patternResult.isValid) {
        return patternResult;
      }

      // Check domain reputation
      const domainResult = this.checkDomainReputation(url.hostname);
      if (!domainResult.isValid) {
        return domainResult;
      }

      // Check URL length
      if (urlString.length > 2048) {
        return {
          isValid: false,
          reason: 'URL is too long (max 2048 characters)',
          risk: 'medium',
        };
      }

      // Check for excessive redirects (would need implementation)
      // const redirectResult = await this.checkRedirects(urlString);

      return { isValid: true, risk: 'low' };
    } catch (error) {
      return {
        isValid: false,
        reason: 'Invalid URL format',
        risk: 'medium',
      };
    }
  }

  /**
   * Check if hostname is localhost or private IP
   */
  private static isLocalOrPrivateIP(hostname: string): boolean {
    // Localhost
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1'
    ) {
      return true;
    }

    // Private IP ranges
    const privateIPPatterns = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./, // Link-local
      /^224\./, // Multicast
      /^255\./, // Broadcast
    ];

    return privateIPPatterns.some((pattern) => pattern.test(hostname));
  }

  /**
   * Check against blacklist database
   */
  private static async checkBlacklist(
    urlString: string
  ): Promise<URLValidationResult> {
    try {
      const url = new URL(urlString);
      const domain = url.hostname;

      const blacklistedUrl = await BlacklistedUrl.findOne({
        $or: [{ url: urlString }, { url: domain }, { url: `*.${domain}` }],
      });

      if (blacklistedUrl) {
        return {
          isValid: false,
          reason: 'URL is blacklisted',
          risk: 'high',
        };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: true }; // Don't block on database errors
    }
  }

  /**
   * Check for suspicious patterns
   */
  private static checkSuspiciousPatterns(
    urlString: string
  ): URLValidationResult {
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(urlString)) {
        return {
          isValid: false,
          reason: 'URL contains suspicious patterns',
          risk: 'high',
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Check domain reputation
   */
  private static checkDomainReputation(hostname: string): URLValidationResult {
    // Remove subdomain for checking
    const baseDomain = this.extractBaseDomain(hostname);

    // Check if it's a known safe domain
    if (this.safeDomains.has(baseDomain)) {
      return { isValid: true, risk: 'low' };
    }

    // Check if it's a known malicious domain
    if (this.maliciousDomains.has(baseDomain)) {
      return {
        isValid: false,
        reason: 'Domain is known to be malicious',
        risk: 'high',
      };
    }

    // Check for suspicious domain characteristics
    if (this.isSuspiciousDomain(hostname)) {
      return {
        isValid: false,
        reason: 'Domain appears suspicious',
        risk: 'medium',
      };
    }

    return { isValid: true, risk: 'medium' };
  }

  /**
   * Extract base domain from hostname
   */
  private static extractBaseDomain(hostname: string): string {
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return hostname;
  }

  /**
   * Check if domain has suspicious characteristics
   */
  private static isSuspiciousDomain(hostname: string): boolean {
    // Very long domains
    if (hostname.length > 50) return true;

    // Excessive subdomains
    if (hostname.split('.').length > 5) return true;

    // Random-looking domains
    if (/^[a-z0-9]{10,}\./.test(hostname)) return true;

    // Mixed case in suspicious way
    if (/[A-Z]{3,}/.test(hostname)) return true;

    // Contains numbers in suspicious way
    if (/\d{4,}/.test(hostname)) return true;

    return false;
  }
}

/**
 * Spam detection for URL patterns
 */
export class SpamDetector {
  /**
   * Check if user behavior is spam-like
   */
  static async checkSpamBehavior(
    userId: string | null,
    urlString: string
  ): Promise<boolean> {
    if (!userId) {
      // For anonymous users, check IP-based patterns
      return false; // Would implement IP-based checking
    }

    // Import inside function to avoid circular dependencies
    const Url = (await import('../models/Url')).default;

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Check for extremely rapid URL creation (likely bot)
    const recentUrls = await Url.countDocuments({
      userId: userId,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentUrls > 100) {
      return true; // More than 100 URLs in an hour - likely automated
    }

    // Check for excessive duplicate URLs (spam pattern)
    const duplicateUrls = await Url.countDocuments({
      userId: userId,
      longUrl: urlString,
      createdAt: { $gte: oneDayAgo },
    });

    if (duplicateUrls > 10) {
      return true; // Too many exact duplicates - spam pattern
    }

    return false;
  }
}
