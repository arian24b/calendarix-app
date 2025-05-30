import withSerwistInit from "@serwist/next";

// PWA configuration
const withPWA = withSerwistInit({
  // Service worker configuration
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Disable the service worker in development for easier testing
  // Set to false to test in development
  disable: false,
  cacheOnNavigation: true,
  reloadOnOnline: true,
  swUrl: "/sw.js",
});

const nextConfig = {
  output: "standalone",
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    viewTransition: true,
  },
  reactStrictMode: true,
  // Cache HTTP responses
  headers: async () => {
    return [
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400", // 1 day
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
  // PWA image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default withPWA(nextConfig);
