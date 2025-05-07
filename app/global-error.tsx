"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";
import { usePathname } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    logger.error(
      "Global Error",
      {
        path: pathname,
        method: "CLIENT",
      },
      error
    );
  }, [error, pathname]);

  return (
    <html lang="fa" dir="rtl">
      <body>
        <div className="container flex flex-col items-center justify-center min-h-screen gap-6 text-center">
          <h1 className="text-4xl font-bold text-destructive">systemError</h1>

          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">unexpectedProblem</p>
            <p className="text-sm text-muted-foreground">
              errorCode {error.digest || "N/A"}
            </p>
          </div>

          <div className="flex gap-4">
            <Button size="lg" onClick={() => reset()} className="gap-2">
              <span>tryAgain</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="size-4"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.assign("/")}
            >
              backToHome
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
