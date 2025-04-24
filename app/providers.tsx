"use client";

import { ThemeProvider } from "next-themes";
import type React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableColorScheme
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col h-screen">
        {children}
      </div>
    </ThemeProvider>
  );
}
