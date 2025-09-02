import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
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
    "/settings/:path*"
  ]
}