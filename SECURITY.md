# Security Features

DV4 Links is completely free to use with comprehensive protection against abuse and malicious activity.

## Protection Layers

### 1. Rate Limiting (Anti-Abuse Only)

- **API Endpoints**: 1000 requests per 15 minutes
- **URL Creation (Authenticated)**: 30 URLs per minute
- **URL Creation (Anonymous)**: 50 URLs per 5 minutes
- **Anonymous IP Limit**: 200 URLs per hour per IP
- **Authentication**: 10 attempts per 15 minutes
- **Password Reset**: 3 attempts per hour (security)

### 2. URL Validation & Security

- Protocol validation (HTTP/HTTPS only)
- Blacklist checking against known malicious domains
- Suspicious pattern detection (phishing, malware keywords)
- Prevention of URL shortener chains
- Local/private IP blocking
- Domain reputation checking

### 3. Free Usage for Everyone

#### All Users Get

- **Unlimited URLs** (with reasonable anti-abuse limits)
- **Custom slugs** allowed for everyone
- **Expiration settings** available
- **1-year analytics retention**
- **2048 character URL limit**
- **All features** completely free

### 4. Anti-Abuse Detection

- **Bot Detection**: More than 100 URLs/hour from one user
- **Spam Prevention**: More than 10 duplicate URLs/day
- **Burst Protection**: Automated rapid-fire detection
- **Timing Analysis**: Suspicious creation patterns
- **Malicious URL Blocking**: Real-time threat detection

### 5. Monitoring & Logging

- Comprehensive audit logging
- Real-time abuse detection
- Performance monitoring
- Security event tracking
- Admin dashboard for monitoring

## Implementation Details

### Rate Limiting

```typescript
// Example: URL creation rate limit
const rateLimit = rateLimiters.urlCreation(request);
if (!rateLimit.allowed) {
  return 429; // Too Many Requests
}
```

### URL Validation

```typescript
const urlValidation = await URLValidator.validateURL(longUrl);
if (!urlValidation.isValid) {
  return 400; // Bad Request
}
```

### Anti-Abuse Detection

```typescript
// Check for suspicious automated behavior
const isSuspicious = await UserConfigManager.checkSuspiciousActivity(userId);
if (isSuspicious) {
  return 403; // Suspicious Activity Detected
}
```

### Security Logging

```typescript
await SecurityLogger.logSuspiciousActivity(
  'spam_detected',
  {
    pattern: 'excessive_url_creation',
  },
  { userId, ipAddress, userAgent }
);
```

## Monitoring

### Admin Endpoint

- `GET /api/admin/security/stats` - Security statistics and recent events
- Requires admin authentication
- Provides abuse metrics and event logs

### Log Categories

- **Rate Limit Violations**: Excessive API usage attempts
- **Blocked URLs**: Malicious/suspicious URLs detected
- **Bot Detection**: Automated abuse patterns
- **Suspicious Activity**: Unusual behavior patterns
- **Security Events**: Authentication and access violations

## Configuration

### Environment Variables

```env
# Rate limiting (optional, defaults provided)
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Security settings
SECURITY_LOG_RETENTION_DAYS=90
BLACKLIST_CHECK_ENABLED=true
```

### Production Recommendations

1. Use Redis for rate limiting in production
2. Implement external monitoring (Datadog, New Relic)
3. Set up alerting for critical security events
4. Regular review of abuse statistics
5. Periodic blacklist updates

## Response Codes

- `400` - Invalid URL or validation failed
- `403` - Forbidden (suspicious activity detected)
- `429` - Rate limited (anti-abuse protection)
- `500` - Internal server error

All security violations are logged with appropriate context for investigation.

## Attack Detection & Response

When suspicious or malicious activity is detected, DV4 Links responds automatically:

### Immediate Actions

#### Rate Limit Violations

- **Response**: `429 Too Many Requests`
- **Behavior**: Temporary blocking with retry-after header
- **Duration**: Until rate limit window resets
- **Message**: "Rate limit exceeded. Please try again later."

#### Malicious URL Detection

- **Response**: `400 Bad Request`
- **Behavior**: URL rejected immediately
- **Logging**: URL logged to security audit trail
- **Message**: Specific reason (e.g., "URL contains suspicious patterns")

#### Bot/Spam Detection

- **Response**: `403 Forbidden`
- **Behavior**: Request blocked, user flagged for monitoring
- **Triggers**:
  - > 100 URLs/hour from single user
  - > 10 duplicate URLs/day
  - > 80% rapid-fire creation pattern
- **Message**: "Suspicious activity detected. Please contact support."

#### IP-Based Blocking (Anonymous Users)

- **Response**: `429 Too Many Requests`
- **Behavior**: IP temporarily blocked
- **Duration**: 1 hour reset window
- **Message**: "Hourly IP limit exceeded - please wait or sign up for an account"

### Security Logging

All detected attacks are automatically logged with:

- **Event Type**: Rate limit, blocked URL, bot detection, etc.
- **Severity Level**: Low, medium, high, critical
- **Context**: IP address, user agent, user ID (if applicable)
- **Timestamp**: Precise time of incident
- **Details**: Specific patterns or thresholds triggered

### Escalation Process

#### Repeated Violations

1. **First offense**: Temporary rate limiting
2. **Continued abuse**: Extended blocking periods
3. **Persistent attacks**: IP/user flagged for manual review

#### Critical Threats

- **Malware URLs**: Immediately blocked and reported
- **Phishing attempts**: Added to blacklist database
- **DDoS patterns**: Automatic IP blocking with alerts

### User Experience Impact

#### For Legitimate Users

- **Minimal disruption**: Generous limits won't affect normal usage
- **Clear messaging**: Informative error messages if limits hit
- **Quick recovery**: Short reset windows for rate limits

#### For Attackers

- **Progressive blocking**: Increasingly strict responses
- **Comprehensive logging**: Full audit trail for investigation
- **No workarounds**: Multiple detection layers prevent bypass

## Free Usage Philosophy

DV4 Links is designed to be **completely free** while protecting against abuse:

- **No quotas or limits** for legitimate usage
- **Generous rate limits** that won't impact normal users
- **Smart abuse detection** that targets only malicious behavior
- **All features unlocked** for everyone
- **Focus on security** rather than artificial restrictions
