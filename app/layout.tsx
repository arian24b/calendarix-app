import type React from "react"
import "./globals.css"

export const metadata = {
  title: "Calendarix",
  description: "Organize your life with Calendarix",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


import './globals.css'