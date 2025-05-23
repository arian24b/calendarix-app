// Service Worker for PWA
/// <reference lib="webworker" />

import type { PrecacheEntry } from "@serwist/precaching"
import { installSerwist } from "@serwist/sw"

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[]
}

// Handle push notifications
self.addEventListener('push', (event: PushEvent) => {
  // Parse the notification data
  let data;
  try {
    data = event.data?.json() ?? {};
  } catch (error) {
    // If JSON parsing fails, try to get the text
    data = {
      title: 'New Notification',
      body: event.data?.text() ?? 'You have received a new notification',
    };
  }

  const title = data.title || 'Calendarix';
  const options: NotificationOptions = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/maskable-icon.png',
    data: data.data || {},
    // @ts-expect-error - vibrate is a valid option but TypeScript doesn't recognize it
    vibrate: [100, 50, 100],
    // Important for replacing notifications with same tag
    tag: data.tag || 'default',
    // Renotify even if there's a notification with same tag
    renotify: data.renotify || false,
    actions: data.actions || [
      {
        action: 'open',
        title: 'Open App',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      }
    ],
    // Show notification with sound on Android
    silent: data.silent || false,
    // When notification was received (if not provided, use current time)
    timestamp: data.timestamp || Date.now(),
    // Persistent notification that requires interaction to dismiss
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click events
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList: readonly WindowClient[]) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        // If a matching window exists, focus it
        if ('focus' in client) return client.focus();
      }
      // If no matching window exists, open one
      if (self.clients.openWindow) {
        const url = event.notification.data?.url || '/';
        return self.clients.openWindow(url);
      }
      return Promise.resolve();
    })
  );
});

const defaultCache = {
  matcher: ({ request }: { request: Request }) => request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  handler: "StaleWhileRevalidate",
  options: {
    cacheName: "default-cache",
    expiration: {
      maxEntries: 100,
      maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
    },
  },
};

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  fallbacks: {
    // Define an offline fallback for HTML documents
    entries: [
      {
        // This fallback will be used for all navigation requests when offline
        url: "/offline",
        revision: "offline",
        matcher: ({ request }: { request: Request }) => request.mode === "navigate"
      }
    ]
  },
  runtimeCaching: [
    // Cache images
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Cache API responses
    {
      urlPattern: /\/v1\/(?!OAuth)/i, // Cache API responses except auth endpoints
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    // Cache fonts
    {
      urlPattern: /\.(?:woff|woff2|ttf|eot)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "fonts",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    // Cache CSS/JS
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
      },
    },
    // Cache static assets
    defaultCache,
  ],
})
