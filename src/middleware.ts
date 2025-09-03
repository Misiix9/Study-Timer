import { NextRequest, NextResponse } from 'next/server'
import { 
  apiRateLimit, 
  authRateLimit, 
  addSecurityHeaders, 
  validateInput, 
  logSecurityEvent 
} from './middleware/security'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const response = NextResponse.next()
  
  try {
    // Apply rate limiting
    let rateLimitResponse = null
    
    if (pathname.startsWith('/api/auth/')) {
      rateLimitResponse = authRateLimit(req)
    } else if (pathname.startsWith('/api/')) {
      rateLimitResponse = apiRateLimit(req)
    }
    
    if (rateLimitResponse) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', req, { path: pathname })
      return addSecurityHeaders(rateLimitResponse)
    }
    
    // Input validation for API requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && pathname.startsWith('/api/')) {
      const validationResponse = validateInput(req)
      if (validationResponse) {
        logSecurityEvent('INVALID_INPUT', req, { path: pathname })
        return addSecurityHeaders(validationResponse)
      }
    }
    
    // Log API requests in production
    if (pathname.startsWith('/api/') && process.env.NODE_ENV === 'production') {
      const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      console.log(`[API] ${req.method} ${pathname} - ${clientIP}`)
    }
    
  } catch (error) {
    console.error('[MIDDLEWARE ERROR]', error)
    logSecurityEvent('MIDDLEWARE_ERROR', req, { error: String(error) })
  }
  
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    "/api/:path*",
  ]
}