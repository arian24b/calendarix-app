import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Calendarix",
    short_name: "Calendarix",
    description: "Organize your life with Calendarix - Events, Tasks, and Reminders",
    start_url: "/?utm_source=pwa",
    display: "standalone",
    background_color: "#fffdf8",
    theme_color: "#414ba4",
    orientation: "portrait",
    id: "/",
    scope: "/",
    categories: ["productivity", "utilities", "lifestyle"],
    shortcuts: [
      {
        name: "Calendar",
        url: "/calendar/?utm_source=homescreen",
        description: "View your calendar",
        icons: [{ src: "/icons/calendar-icon.png", sizes: "192x192", type: "image/png" }]
      },
      {
        name: "Add Event",
        url: "/add-event/?utm_source=homescreen",
        description: "Add a new event",
        icons: [{ src: "/icons/add-event-icon.png", sizes: "192x192", type: "image/png" }]
      }
    ],
    screenshots: [
      {
        src: "/screenshots/desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshots/mobile.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/monochrome-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "monochrome",
      },
      // Apple touch icon is handled separately in the layout.tsx head
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      }
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
