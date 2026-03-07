// ─────────────────────────────────────────────────────────────
// Vastrayug — Route Protection Middleware
// Reference: tech_stack.md §5 — Route Protection (middleware.ts)
//
// Protected routes:
//   /admin/*    → requires auth + admin role (SUPER_ADMIN, CONTENT_MANAGER, ORDER_MANAGER)
//   /account/*  → requires auth (any logged-in user)
//   /checkout/* → requires auth (any logged-in user)
//
// All other routes pass through without auth checks.
// ─────────────────────────────────────────────────────────────

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

    // Admin routes require an admin role
    if (
      isAdminRoute &&
      !['SUPER_ADMIN', 'CONTENT_MANAGER', 'ORDER_MANAGER'].includes(
        token?.role as string
      )
    ) {
      return NextResponse.redirect(
        new URL('/login?error=unauthorized', req.url)
      )
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/admin/:path*'],
}
