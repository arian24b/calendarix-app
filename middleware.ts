import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

// Security headers for the response
const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self' 'unsafe-inline' data: blob: https://api.calendarix.pro https://accounts.google.com https://apis.google.com;" +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;" +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://api.calendarix.pro https://accounts.google.com;" +
    "font-src 'self' data: https://fonts.gstatic.com;" +
    "img-src 'self' data: blob: https://*.googleusercontent.com https://api.calendarix.pro https://*.producthunt.com;" +
    "worker-src 'self' blob: https://api.calendarix.pro;" +
    "connect-src 'self' http://127.0.0.1:3000 ws://127.0.0.1:8090 https://api.calendarix.pro http://api.calendarix.pro http://localhost:3000 https://accounts.google.com https://oauth2.googleapis.com;",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

// Allowed origins for CORS
const allowedOrigins = [
  "https://api.calendarix.pro",
  "http://api.calendarix.pro",
  "https://calendarix.pro",
  "http://calendarix.pro",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://accounts.google.com",
  "https://oauth2.googleapis.com"
];

// CORS options
const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Credentials": "true"
};

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

function setCORSHeaders(response: NextResponse, origin: string | null) {
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

function setSecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");
  
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });
    setCORSHeaders(response, origin);
    return response;
  }

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

  const response = NextResponse.next();
  
  // Set CORS headers if origin is allowed
  setCORSHeaders(response, origin);
  
  // Set security headers
  setSecurityHeaders(response);

  return response;
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
