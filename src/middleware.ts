import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'
import { 
  apiRateLimit, 
  authRateLimit, 
  addSecurityHeaders, 
  validateInput, 
  logSecurityEvent 
} from './middleware/security'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    let response = NextResponse.next()
    
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
        console.log(`[API] ${req.method} ${pathname} - ${req.ip || 'unknown'}`)
      }
      
    } catch (error) {
      console.error('[MIDDLEWARE ERROR]', error)
      logSecurityEvent('MIDDLEWARE_ERROR', req, { error: String(error) })
    }
    
    return addSecurityHeaders(response)
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/timer/:path*", 
    "/analytics/:path*",
    "/subjects/:path*",
    "/goals/:path*",
    "/settings/:path*",
    "/api/:path*",
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-:path*).*)',
  ]
}