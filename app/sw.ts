import { clientsClaim } from "workbox-core"
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { registerRoute } from "workbox-routing"
import { NetworkFirst } from "workbox-strategies"

declare let self: ServiceWorkerGlobalScope

clientsClaim()

precacheAndRoute(self.__WB_MANIFEST)

const fileExtensionRegexp = /\/[^/?]+\.[^/]+$/

registerRoute(
  ({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== "navigate") {
      return false
    }

    if (url.pathname.startsWith("/_")) {
      return false
    }

    if (url.pathname.match(fileExtensionRegexp)) {
      return false
    }

    return true
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html"),
)

registerRoute(
  /^https:\/\/.*\/v1\//,
  new NetworkFirst({
    cacheName: "api-cache-v2",
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => {
          // Create a cache key that includes auth headers for user-specific data
          const url = new URL(request.url)
          return `${url.pathname}${url.search}`
        },
      },
    ],
    networkTimeoutSeconds: 10,
    cacheOptions: {
      maxEntries: 200,
      maxAgeSeconds: 24 * 60 * 60, // 24 hours
    },
  }),
)

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // First, try to use the navigation preload response if it's supported.
          const preloadResponse = await event.preloadResponse
          if (preloadResponse) {
            return preloadResponse
          }

          // Always try the network first.
          const networkResponse = await fetch(event.request)
          return networkResponse
        } catch (error) {
          // catch is only triggered if an exception is thrown, which is likely
          // due to a network error.
          // If fetch() throws, check to see if we have a cached version
          // available.
          return caches.match(event.request)
        }
      })(),
    )
  }
})

self.addEventListener("install", (event) => {
  // @ts-ignore
  event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", (event) => {
  // @ts-ignore
  event.waitUntil(self.clients.claim())
})
