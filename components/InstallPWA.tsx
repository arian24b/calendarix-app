"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if on iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Store the install prompt event for later use
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    // Check if the app is already installed
    const isAppInstalled = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    if (!isAppInstalled) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the saved prompt as it can't be used again
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const closeBanner = () => {
    setShowBanner(false);
    // Store in localStorage to avoid showing again in this session
    localStorage.setItem("pwaInstallBannerClosed", "true");
  };

  // Don't show anything if banner is hidden or app is already installed
  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 flex items-center justify-between z-50 shadow-lg">
      <div className="flex-1">
        {isIOS ? (
          <p>
            Install this app on your device: tap{" "}
            <span className="font-bold">Share</span> then{" "}
            <span className="font-bold">Add to Home Screen</span>
          </p>
        ) : (
          <p>Install Calendarix for a better experience</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!isIOS && deferredPrompt && (
          <Button onClick={handleInstallClick} variant="secondary" size="sm">
            Install
          </Button>
        )}
        <Button
          onClick={closeBanner}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
