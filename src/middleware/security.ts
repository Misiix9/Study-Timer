import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const defaultRateLimit: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100
}

const strictRateLimit: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5
}

export function rateLimit(config: RateLimitConfig = defaultRateLimit) {
  return (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const key = `${ip}:${req.nextUrl.pathname}`
    const now = Date.now()
    
    const record = rateLimitStore.get(key)
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      })
      return null // Allow request
    }
    
    if (record.count >= config.maxRequests) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((record.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': record.resetTime.toString()
          }
        }
      )
    }
    
    record.count++
    rateLimitStore.set(key, record)
    return null // Allow request
  }
}

export function validateInput(req: NextRequest) {
  const contentType = req.headers.get('content-type')
  
  if (req.method !== 'GET' && req.method !== 'DELETE') {
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type', code: 'INVALID_CONTENT_TYPE' },
        { status: 400 }
      )
    }
  }
  
  return null
}

export function addSecurityHeaders(response: NextResponse) {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.studytimer.app wss:",
      "media-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  )
  
  // HSTS
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  
  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY')
  
  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // X-DNS-Prefetch-Control
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), location=(), payment=()'
  )
  
  return response
}

export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove potential XSS characters
      .trim()
      .substring(0, 1000) // Limit length
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      if (typeof key === 'string' && key.length <= 100) {
        sanitized[key] = sanitizeInput(value)
      }
    }
    return sanitized
  }
  
  return input
}

export function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    req.ip ||
    'unknown'
  )
}

export function logSecurityEvent(
  event: string,
  req: NextRequest,
  details?: Record<string, any>
) {
  const logData = {
    timestamp: new Date().toISOString(),
    event,
    ip: getClientIP(req),
    userAgent: req.headers.get('user-agent'),
    url: req.url,
    method: req.method,
    ...details
  }
  
  // In production, send to logging service
  console.warn('[SECURITY]', JSON.stringify(logData))
}

// Middleware for authentication endpoints
export const authRateLimit = rateLimit(strictRateLimit)

// Middleware for API endpoints
export const apiRateLimit = rateLimit(defaultRateLimit)

// Export rate limit configurations
export { defaultRateLimit, strictRateLimit }