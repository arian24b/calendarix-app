import { type NextRequest } from 'next/server';

// Define a push subscription type
interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// In-memory store for subscriptions (replace with proper database in production)
let subscriptions: PushSubscription[] = [];

/**
 * API handler for storing push notification subscriptions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, action } = body;

    if (!subscription) {
      return Response.json({ success: false, message: 'No subscription data provided' }, { status: 400 });
    }

    // Validate subscription data
    if (!subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      return Response.json({ success: false, message: 'Invalid subscription data' }, { status: 400 });
    }

    // Handle subscription actions (subscribe or unsubscribe)
    if (action === 'subscribe') {
      // Check if subscription already exists
      const exists = subscriptions.some(sub => sub.endpoint === subscription.endpoint);

      if (!exists) {
        // Store the subscription in your database here
        // Example: await db.pushSubscriptions.create({ data: subscription });

        // For now, we'll store in memory (replace with DB in production)
        subscriptions.push(subscription);
        console.log('Subscription saved:', subscription.endpoint);
      }

      return Response.json({ success: true, message: 'Subscription saved successfully' });
    }
    else if (action === 'unsubscribe') {
      // Remove subscription from storage
      // Example: await db.pushSubscriptions.delete({ where: { endpoint: subscription.endpoint } });

      // For now, we'll remove from our in-memory store
      subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
      console.log('Subscription removed:', subscription.endpoint);

      return Response.json({ success: true, message: 'Subscription removed successfully' });
    }

    return Response.json({ success: false, message: 'Invalid action specified' }, { status: 400 });
  } catch (error) {
    console.error('Error handling push subscription:', error);
    return Response.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

/**
 * API handler for retrieving subscription count (admin only)
 */
export async function GET() {
  // In production, this should be protected by authentication
  return Response.json({
    success: true,
    count: subscriptions.length
  });
}
