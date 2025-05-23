// Push notification service
// This service handles push notification subscription and management

/**
 * Check if Push notifications are supported by the browser
 */
export function isPushNotificationSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Get the active service worker registration
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushNotificationSupported()) {
    return null;
  }

  try {
    return await navigator.serviceWorker.ready;
  } catch (error) {
    console.error('Error getting service worker registration:', error);
    return null;
  }
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

/**
 * Get the current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }

  return Notification.permission;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  const registration = await getServiceWorkerRegistration();
  if (!registration) {
    return null;
  }

  try {
    // Get existing subscription or create a new one
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      return subscription;
    }

    // Subscribe with userVisibleOnly set to true
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true
    });

    await sendSubscriptionToServer(subscription, 'subscribe');
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
}

/**
 * Send subscription to server for storage
 */
export async function sendSubscriptionToServer(
  subscription: PushSubscription,
  action: 'subscribe' | 'unsubscribe'
): Promise<boolean> {
  try {
    const response = await fetch('/api/push-notifications/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription,
        action
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error sending subscription to server:', error);
    return false;
  }
}

/**
 * Get the current push subscription if it exists
 */
export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  const registration = await getServiceWorkerRegistration();
  if (!registration) {
    return null;
  }

  try {
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting push subscription:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  const subscription = await getCurrentPushSubscription();
  if (!subscription) {
    return true; // Already unsubscribed
  }

  try {
    // First notify the server
    await sendSubscriptionToServer(subscription, 'unsubscribe');

    // Then unsubscribe locally
    const success = await subscription.unsubscribe();
    return success;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
}
