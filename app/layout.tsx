import type React from "react"
import type { Metadata, Viewport } from "next/types"
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "@/styles/globals.css"
import { ApiProvider } from "@/components/api-provider"
import { AuthProvider } from "@/contexts/auth-context"
import config from "@/lib/config"


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
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className="scroll-smooth"
    >
      <body className={cn("min-h-screen bg-background Inter antialiased ltr")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableColorScheme
          enableSystem
          disableTransitionOnChange>
          <AuthProvider>
            <ApiProvider>
              {children}
              <Toaster position="top-center" richColors />
            </ApiProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
