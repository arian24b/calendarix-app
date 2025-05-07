import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define paths that require authentication
const protectedPaths = [
  "/profile"
]

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((protectedPath) =>
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  )

  // Get the token from cookies
  const token = request.cookies.get("token")?.value

  // If the path requires authentication and there's no token, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(url)
  }

  // If the user is authenticated and trying to access login/register pages, redirect to calendar
  if (token && path.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/calendar", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|placeholder.svg).*)",
  ],
}
