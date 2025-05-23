/**
 * Push notification configuration
 * Simplified version without VAPID keys
 */

/**
 * Get the push notification API endpoint
 */
export const getPushApiEndpoint = (): string => {
  return '/api/push-notifications';
};

/**
 * Get the push API actions
 */
export const getPushApiActions = () => {
  return {
    subscribe: 'subscribe',
    unsubscribe: 'unsubscribe'
  };
};
