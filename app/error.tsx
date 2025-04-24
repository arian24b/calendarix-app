"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Page error:", error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[80dvh] gap-6 text-center">
      <h2 className="text-3xl font-bold text-destructive">pageLoadingError</h2>

      <div className="space-y-2">
        <p className="text-muted-foreground">
          {error.message || "systemError"}
        </p>
        <p className="text-sm text-muted-foreground">
          trackingCode {error.digest || "N/A"}
        </p>
      </div>

      <Button size="lg" onClick={() => reset()} className="gap-2">
        tryAgain
      </Button>
    </div>
  );
}
