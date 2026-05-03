import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Role-based access control
    if (path.startsWith("/owner") && token?.role !== "OWNER") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (path.startsWith("/admin") && token?.role !== "ADMIN" && token?.role !== "OWNER") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (path.startsWith("/worker") && !["PEKERJA", "ADMIN", "OWNER"].includes(token?.role as string)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ["/owner/:path*", "/admin/:path*", "/worker/:path*"]
}
