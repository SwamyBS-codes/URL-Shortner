/**
 * Rate Limiter Middleware
 * Tracks requests per IP and enforces rate limits
 */

// TODO: Customize these limits based on your needs
const RATE_LIMITS = {
  // General API endpoints: 100 requests per 15 minutes
  general: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // Link creation: 20 requests per hour
  createLink: {
    maxRequests: 30,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // Redirect/resolve: No limit (or very high)
  redirect: {
    maxRequests: 1000,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
}

// Store request counts by IP
// Structure: { ip: { count: number, resetTime: timestamp } }
const requestLog = new Map()

/**
 * Extract client IP from request
 * Handles proxies and load balancers
 */
function getClientIp(req) {
        
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.ip ||
    req.connection.remoteAddress
  )
}

/**
 * Generic rate limiter factory
 * Returns middleware function
 */
export function createRateLimiter(limitConfig = RATE_LIMITS.general) {
  return function rateLimitMiddleware(req, res, next) {
    // TODO: Extract client IP
    const clientIp = getClientIp(req)

    const now = Date.now()
    const request = requestLog.get(clientIp) || { count: 0, resetTime: now + limitConfig.windowMs }

    // TODO: Check if window has expired
    if (now > request.resetTime) {
      request.count = 0
      request.resetTime = now + limitConfig.windowMs
    }

    // TODO: Increment request count
    request.count++

    // TODO: Store updated request
    requestLog.set(clientIp, request)

    // TODO: Check if limit exceeded
    if (request.count > limitConfig.maxRequests) {
      const retryAfter = Math.ceil((request.resetTime - now) / 1000)
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter,
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      })
    }

    // TODO: Optional: Add rate limit info to response headers
    res.set('X-RateLimit-Limit', limitConfig.maxRequests)
    res.set('X-RateLimit-Remaining', limitConfig.maxRequests - request.count)
    res.set('X-RateLimit-Reset', request.resetTime)

    next()
  }
}

/**
 * Cleanup old entries from requestLog
 * Run periodically to free memory
 * TODO: Call this in your server startup if needed
 */
export function cleanupRateLimitLog() {
  const now = Date.now()
  let cleaned = 0

  for (const [ip, request] of requestLog.entries()) {
    if (now > request.resetTime) {
      requestLog.delete(ip)
      cleaned++
    }
  }

  console.log(`Cleaned up ${cleaned} expired rate limit entries`)
}

/**
 * Middleware preset for general API
 */
export const generalRateLimiter = createRateLimiter(RATE_LIMITS.general)

/**
 * Middleware preset for link creation
 */
export const createLinkRateLimiter = createRateLimiter(RATE_LIMITS.createLink)

/**
 * Middleware preset for redirect
 */
export const redirectRateLimiter = createRateLimiter(RATE_LIMITS.redirect)

// Optional: Cleanup every hour
setInterval(cleanupRateLimitLog, 60 * 60 * 1000)
