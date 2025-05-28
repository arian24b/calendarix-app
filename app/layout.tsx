import type React from "react"
import type { Metadata, Viewport } from "next/types"
import config from "@/lib/config"
import "@/styles/globals.css"


export const metadata: Metadata = {
  metadataBase: new URL(config.site.url),
  applicationName: config.site.name,
  title: config.site.name,
  description: config.site.description,
  manifest: `${config.site.url}/manifest.json`,
  keywords: [
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
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="Inter antialiased ltr">{children}</body>
    </html>
  )
}
