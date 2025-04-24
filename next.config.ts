import type { NextConfig } from "next";

// For PWA support
const withPWA = require('next-pwa')({
  dest: 'public', // service worker file destination
  register: true,
  skipWaiting: true,
  // Optionally, you can customize caching strategies:
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    // add more caching rules as needed
  ],
});

const nextConfig: NextConfig = {
  output: "export",
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
};

// Apply PWA wrapper to the Next.js config
export default withPWA(nextConfig);
