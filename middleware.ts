import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedPaths = [
  "/profile",
  "/calendar",
  "/events",
  "/tasks",
  "/alarms",
  "/categories",
  "/ai-suggestions",
  "/add-event",
  "/add-dietary-event"
];

// Authentication routes
const authPaths = [
  "/auth",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password"
];

// Public paths that don't require authentication
const publicPaths = [
  "/",
  "/onboarding",
  "/offline",
  "/pwa-install"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value ||
                request.headers.get("authorization")?.replace("Bearer ", "");

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  const isAuthPath = authPaths.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // If user is trying to access protected route without token
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access auth pages, redirect to calendar
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/calendar", request.url));
  }

  // Handle root path redirect
  if (pathname === "/") {
    const hasCompletedOnboarding = request.cookies.get("hasCompletedOnboarding")?.value;

    if (!hasCompletedOnboarding) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (token) {
      return NextResponse.redirect(new URL("/calendar", request.url));
    }

    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     * - manifest.json (PWA manifest)
     * - icons/ (PWA icons)
     * - images/ (static images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json|icons|images).*)",
  ],
};
