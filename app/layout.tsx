import type React from "react"
import type { Metadata, Viewport } from "next/types"
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "@/styles/globals.css"
import config from "@/lib/config"

// Import ServiceWorkerLoader directly - we'll make it handle client-side only itself
import ServiceWorkerLoader from './ServiceWorkerLoader'


export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  applicationName: config.site.name,
  title: config.site.name,
  description: config.site.description,
  keywords: [
    "Monthly",
    "Calendar",
    "Events",
    "Organized",
    "Categories",
    "Tasks",
    "Clock",
    "Alarm",
    "Google Calendar",
    "Integration",
    "Notifications",
    "AI-Powered",
    "Smart Plans",
    "User Input",
    "Workout Plans",
    "Dietary Regimes",
    "Profile",
    "Settings",
    "Planning",
    "Management",
  ],
  authors: [{ name: "S2DIO", url: "https://s2dio.ir" }],
  openGraph: {
    title: config.seo.defaultTitle,
    description: config.seo.defaultDescription,
    url: config.site.url,
    siteName: config.site.name,
    images: config.seo.openGraph.images,
    locale: config.site.defaultLocale,
  },
  twitter: {
    card: "summary_large_image",
    title: config.seo.defaultTitle,
    description: config.seo.defaultDescription,
    images: `${config.site.url}/og-image.jpg`,
    creator: config.seo.twitter.handle,
  },
  robots: "index, follow",
  // Add Apple PWA specific metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: config.site.name,
    startupImage: [
      {
        url: "/apple-splash/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/apple-splash/apple-splash-1668-2388.png",
        media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/apple-splash/apple-splash-1536-2048.png",
        media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/apple-splash/apple-splash-1242-2688.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      },
      {
        url: "/apple-splash/apple-splash-1125-2436.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      },
      {
        url: "/apple-splash/apple-splash-828-1792.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/apple-splash/apple-splash-750-1334.png",
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/apple-splash/apple-splash-640-1136.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      }
    ]
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className="scroll-smooth"
    >
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body className={cn("min-h-screen bg-background Inter antialiased ltr")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableColorScheme
          enableSystem
          disableTransitionOnChange>
          {children}
          <Toaster position="top-center" richColors />
          <ServiceWorkerLoader />
        </ThemeProvider>
      </body>
    </html>
  )
}
