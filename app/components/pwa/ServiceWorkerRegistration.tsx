"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  isPushNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getCurrentPushSubscription
} from "../../../lib/services/notification-service";

// Define a proper type for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const ServiceWorkerRegistration = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  useEffect(() => {
    // Register the service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: '/' })
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }

    // Check notification support and permission
    const checkNotificationSupport = async () => {
      const supported = isPushNotificationSupported();
      setIsPushSupported(supported);

      if (supported) {
        const permission = getNotificationPermission();
        setNotificationPermission(permission);

        // Check if already subscribed
        const subscription = await getCurrentPushSubscription();
        setIsSubscribed(!!subscription);

        // Show notification prompt if not granted/denied and not shown before
        if (
          permission === "default" &&
          !localStorage.getItem("notificationPromptDismissed")
        ) {
          setShowNotificationPrompt(true);
        }
      }
    };

    checkNotificationSupport();

    // Online/offline detection
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are back online!");
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline. Some features may be unavailable.");
    };

    // Check initial status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Handle "Add to Home Screen" functionality
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show UI indication to install the app
      if (!localStorage.getItem("pwaInstallPromptDismissed")) {
        setShowInstallPrompt(true);
      }
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstallClick = () => {
    setShowInstallPrompt(false);

    // Show the install prompt
    if (installPrompt) {
      installPrompt.prompt();

      // Wait for the user to respond to the prompt
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
          // Remember that user dismissed the prompt
          localStorage.setItem("pwaInstallPromptDismissed", "true");
        }
        setInstallPrompt(null);
      });
    }
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    // Remember that user dismissed the prompt
    localStorage.setItem("pwaInstallPromptDismissed", "true");
  };

  const handleRequestNotificationPermission = async () => {
    setShowNotificationPrompt(false);

    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);

    if (permission === "granted") {
      toast.success("Notification permissions granted!");

      // Subscribe to push notifications
      subscribeToNotifications();
    } else {
      toast.error("Notification permissions denied. You can change this in your browser settings.");
      localStorage.setItem("notificationPromptDismissed", "true");
    }
  };

  const handleDismissNotificationPrompt = () => {
    setShowNotificationPrompt(false);
    localStorage.setItem("notificationPromptDismissed", "true");
  };

  const subscribeToNotifications = async () => {
    try {
      const subscription = await subscribeToPushNotifications();

      if (subscription) {
        setIsSubscribed(true);
        toast.success("Successfully subscribed to notifications!");
      }
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
      toast.error("Failed to subscribe to notifications. Please try again.");
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      const success = await unsubscribeFromPushNotifications();

      if (success) {
        setIsSubscribed(false);
        toast.success("Successfully unsubscribed from notifications.");
      } else {
        toast.error("Failed to unsubscribe from notifications.");
      }
    } catch (error) {
      console.error("Error unsubscribing from notifications:", error);
      toast.error("Failed to unsubscribe from notifications. Please try again.");
    }
  };

  // Render the UI components
  return (
    <>
      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="p-2 rounded-lg bg-primary shadow-lg sm:p-3">
              <div className="flex items-center justify-between flex-wrap">
                <div className="w-0 flex-1 flex items-center">
                  <span className="flex p-2 rounded-lg bg-primary-foreground">
                    <svg
                      className="h-6 w-6 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <p className="ml-3 font-medium text-white truncate">
                    <span className="md:hidden">Install this app!</span>
                    <span className="hidden md:inline">
                      Install this app on your device for offline access!
                    </span>
                  </p>
                </div>
                <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                  <button
                    onClick={handleInstallClick}
                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-indigo-50"
                  >
                    Install now
                  </button>
                </div>
                <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
                  <button
                    type="button"
                    onClick={handleDismissInstall}
                    className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Push Notification Permission Prompt */}
      {showNotificationPrompt && (
        <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="p-2 rounded-lg bg-blue-700 shadow-lg sm:p-3">
              <div className="flex items-center justify-between flex-wrap">
                <div className="w-0 flex-1 flex items-center">
                  <span className="flex p-2 rounded-lg bg-blue-800">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </span>
                  <p className="ml-3 font-medium text-white truncate">
                    <span className="md:hidden">Enable notifications!</span>
                    <span className="hidden md:inline">
                      Enable notifications to stay updated with your events and reminders!
                    </span>
                  </p>
                </div>
                <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                  <button
                    onClick={handleRequestNotificationPermission}
                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
                  >
                    Enable notifications
                  </button>
                </div>
                <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
                  <button
                    type="button"
                    onClick={handleDismissNotificationPrompt}
                    className="-mr-1 flex p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Banner (only shown when offline) */}
      {!isOnline && (
        <div className="fixed top-0 inset-x-0 z-50">
          <div className="bg-yellow-500 text-white p-2 text-center">
            You are currently offline. Some features may be unavailable.
          </div>
        </div>
      )}

      {/* Notification management button for profile page - hidden by default */}
      {isPushSupported && notificationPermission === "granted" && (
        <div className="hidden">
          <button
            onClick={isSubscribed ? unsubscribeFromNotifications : subscribeToNotifications}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubscribed ? "Disable" : "Enable"} Notifications
          </button>
        </div>
      )}
    </>
  );
};

export default ServiceWorkerRegistration;
