import type React from "react";
import { cn } from "@/lib/utils";
import { Providers } from "@/app/providers";
import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import config from "@/lib/config";

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
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className="scroll-smooth"
    >
      <body className={cn("min-h-screen bg-background Inter antialiased ltr")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
