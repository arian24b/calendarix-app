import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

// Security headers for the response
const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self' 'unsafe-inline' data: blob: https://api.calendarix.pro;" +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;" +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://api.calendarix.pro;" +
    "font-src 'self' data: https://fonts.gstatic.com;" +
    "img-src 'self' data: blob: https://*.googleusercontent.com https://api.calendarix.pro https://*.producthunt.com;" +
    "worker-src 'self' blob: https://api.calendarix.pro;" +
    "connect-src 'self' http://127.0.0.1:3000 ws://127.0.0.1:8090 https://api.calendarix.pro http://api.calendarix.pro http://localhost:3000;",
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
];

// CORS options
const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Rate limiting configuration
const rateLimitStore = new Map<
  string,
  { count: number; lastRequest: number }
>();
const RATE_LIMIT = { WINDOW_MS: 60000, MAX_REQUESTS: 1000 };

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

function handleRateLimiting(ip: string): NextResponse | void {
  const currentTime = Date.now();
  const lastRequest = rateLimitStore.get(ip);

  if (
    lastRequest &&
    lastRequest.lastRequest > currentTime - RATE_LIMIT.WINDOW_MS
  ) {
    if (lastRequest.count >= RATE_LIMIT.MAX_REQUESTS) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
    rateLimitStore.set(ip, {
      count: lastRequest.count + 1,
      lastRequest: currentTime,
    });
  } else {
    rateLimitStore.set(ip, { count: 1, lastRequest: currentTime });
  }
}

export async function middleware(request: NextRequest) {
  const start = Date.now();
  let response: NextResponse;

  try {
    // Get origin from request
    const origin = request.headers.get("origin") ?? "";

    // Handle preflight requests (OPTIONS)
    if (request.method === "OPTIONS") {
      const preflightHeaders = {
        ...(allowedOrigins.includes(origin) && {
          "Access-Control-Allow-Origin": origin,
        }),
        ...corsOptions,
      };

      logger.info(`Preflight request: ${request.url}`, {
        origin,
        headers: preflightHeaders,
      });

      return new NextResponse(null, {
        status: 204,
        headers: preflightHeaders,
      });
    }

    // Set the theme cookie or use default if not found
    const theme = request.cookies.get("theme")?.value || "light";
    response = NextResponse.next();
    response.cookies.set("theme", theme, { path: "/", httpOnly: false });

    // Handle rate limiting
    const ip = request.ip ?? "127.0.0.1";
    const rateLimitResponse = handleRateLimiting(ip);
    if (rateLimitResponse) return rateLimitResponse;

    // Set CORS headers if origin is allowed
    setCORSHeaders(response, origin);

    // Set security headers
    setSecurityHeaders(response);

    logger.info(`Request: ${request.method} ${request.url}`, {
      ip,
      theme,
      origin,
      userAgent: request.headers.get("user-agent"),
    });
  } catch (error) {
    console.error("Middleware Error:", error);
    logger.error("Middleware Error", {
      error: error instanceof Error ? error.message : "Unknown",
      url: request.url,
    });

    // Return next response instead of error for auth routes
    response = NextResponse.next();
  } finally {
    const latency = Date.now() - start;
    if (response) {
      response.headers.set("X-Response-Time", `${latency}ms`);

      logger.info(`Response: ${response.status} ${request.url}`, {
        latency,
        status: response.status,
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/healthcheck).*)",
    "/:path*",
    "/api/:path*",
  ],
};
