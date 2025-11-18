const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { db } = require('../config/firebase');

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe requires raw body for webhook signature verification
const stripeWebhookMiddleware = express.raw({ type: 'application/json' });

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
router.post('/stripe', stripeWebhookMiddleware, async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleStripeCheckoutCompleted(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handleStripePaymentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handleStripePaymentFailed(event.data.object);
        break;

      case 'charge.refunded':
        await handleStripeRefund(event.data.object);
        break;

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    res.json({ received: true, eventType: event.type });

  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * POST /api/webhooks/paypal
 * Handle PayPal webhook events
 */
router.post('/paypal', express.json(), async (req, res) => {
  const event = req.body;

  try {
    // PayPal webhook verification should be implemented here
    // For now, we'll process the event (add verification in production)
    console.log('PayPal webhook event:', event.event_type);

    switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        await handlePayPalOrderApproved(event.resource);
        break;

      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePayPalPaymentCompleted(event.resource);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.DECLINED':
        await handlePayPalPaymentFailed(event.resource);
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePayPalRefund(event.resource);
        break;

      default:
        console.log(`Unhandled PayPal event type: ${event.event_type}`);
    }

    res.json({ received: true, eventType: event.event_type });

  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper functions for Stripe webhooks

async function handleStripeCheckoutCompleted(session) {
  console.log('✅ Stripe checkout completed:', session.id);

  const orderId = session.client_reference_id;
  const userId = session.metadata.userId;

  if (!orderId || !userId) {
    console.error('Missing orderId or userId in session metadata');
    return;
  }

  // Update order status
  await db.collection('orders').doc(orderId).update({
    status: 'completed',
    stripePaymentIntentId: session.payment_intent,
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sessionData: {
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_email
    }
  });

  // Upgrade user to Pro
  await upgradeUserToPro(userId, {
    provider: 'stripe',
    transactionId: session.payment_intent || session.id,
    amount: session.amount_total / 100, // Convert from cents
    currency: session.currency,
    timestamp: Date.now()
  });

  console.log(`✅ User ${userId} upgraded to Pro via Stripe`);
}

async function handleStripePaymentSucceeded(paymentIntent) {
  console.log('✅ Stripe payment succeeded:', paymentIntent.id);

  // Find order by payment intent
  const ordersSnapshot = await db.collection('orders')
    .where('stripePaymentIntentId', '==', paymentIntent.id)
    .limit(1)
    .get();

  if (!ordersSnapshot.empty) {
    const orderDoc = ordersSnapshot.docs[0];
    await orderDoc.ref.update({
      status: 'paid',
      updatedAt: new Date().toISOString()
    });
  }
}

async function handleStripePaymentFailed(paymentIntent) {
  console.log('❌ Stripe payment failed:', paymentIntent.id);

  // Find order by payment intent
  const ordersSnapshot = await db.collection('orders')
    .where('stripePaymentIntentId', '==', paymentIntent.id)
    .limit(1)
    .get();

  if (!ordersSnapshot.empty) {
    const orderDoc = ordersSnapshot.docs[0];
    await orderDoc.ref.update({
      status: 'failed',
      failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
      updatedAt: new Date().toISOString()
    });
  }
}

async function handleStripeRefund(charge) {
  console.log('🔄 Stripe refund processed:', charge.id);

  // Find order by payment intent
  const ordersSnapshot = await db.collection('orders')
    .where('stripePaymentIntentId', '==', charge.payment_intent)
    .limit(1)
    .get();

  if (!ordersSnapshot.empty) {
    const orderDoc = ordersSnapshot.docs[0];
    const orderData = orderDoc.data();

    await orderDoc.ref.update({
      status: 'refunded',
      refundedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Optionally downgrade user from Pro
    if (orderData.userId) {
      await db.collection('users').doc(orderData.userId).update({
        isPro: false,
        proDowngradeDate: Date.now(),
        proDowngradeReason: 'refund'
      });
    }
  }
}

// Helper functions for PayPal webhooks

async function handlePayPalOrderApproved(resource) {
  console.log('✅ PayPal order approved:', resource.id);

  const orderId = resource.purchase_units?.[0]?.reference_id;

  if (orderId) {
    await db.collection('orders').doc(orderId).update({
      status: 'approved',
      updatedAt: new Date().toISOString()
    });
  }
}

async function handlePayPalPaymentCompleted(resource) {
  console.log('✅ PayPal payment completed:', resource.id);

  const orderId = resource.supplementary_data?.related_ids?.order_id;
  const customId = resource.custom_id;

  // Try to find order by PayPal order ID
  let orderDoc;
  if (orderId) {
    const ordersSnapshot = await db.collection('orders')
      .where('paypalOrderId', '==', orderId)
      .limit(1)
      .get();

    if (!ordersSnapshot.empty) {
      orderDoc = ordersSnapshot.docs[0];
    }
  }

  if (!orderDoc) {
    console.error('Order not found for PayPal payment:', resource.id);
    return;
  }

  const orderData = orderDoc.data();

  // Update order status
  await orderDoc.ref.update({
    status: 'completed',
    paypalCaptureId: resource.id,
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    captureData: {
      id: resource.id,
      amount: resource.amount,
      status: resource.status
    }
  });

  // Upgrade user to Pro
  await upgradeUserToPro(orderData.userId, {
    provider: 'paypal',
    transactionId: resource.id,
    amount: parseFloat(resource.amount.value),
    currency: resource.amount.currency_code.toLowerCase(),
    timestamp: Date.now()
  });

  console.log(`✅ User ${orderData.userId} upgraded to Pro via PayPal`);
}

async function handlePayPalPaymentFailed(resource) {
  console.log('❌ PayPal payment failed:', resource.id);

  const orderId = resource.supplementary_data?.related_ids?.order_id;

  if (orderId) {
    const ordersSnapshot = await db.collection('orders')
      .where('paypalOrderId', '==', orderId)
      .limit(1)
      .get();

    if (!ordersSnapshot.empty) {
      const orderDoc = ordersSnapshot.docs[0];
      await orderDoc.ref.update({
        status: 'failed',
        failureReason: resource.status_details?.reason || 'Payment failed',
        updatedAt: new Date().toISOString()
      });
    }
  }
}

async function handlePayPalRefund(resource) {
  console.log('🔄 PayPal refund processed:', resource.id);

  // Find order by capture ID
  const ordersSnapshot = await db.collection('orders')
    .where('paypalCaptureId', '==', resource.id)
    .limit(1)
    .get();

  if (!ordersSnapshot.empty) {
    const orderDoc = ordersSnapshot.docs[0];
    const orderData = orderDoc.data();

    await orderDoc.ref.update({
      status: 'refunded',
      refundedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Optionally downgrade user from Pro
    if (orderData.userId) {
      await db.collection('users').doc(orderData.userId).update({
        isPro: false,
        proDowngradeDate: Date.now(),
        proDowngradeReason: 'refund'
      });
    }
  }
}

// Shared helper function to upgrade user to Pro

async function upgradeUserToPro(userId, paymentData) {
  try {
    await db.collection('users').doc(userId).update({
      isPro: true,
      proUpgradeDate: Date.now(),
      paymentData: paymentData
    });

    console.log(`✅ User ${userId} upgraded to Pro successfully`);
  } catch (error) {
    console.error(`Error upgrading user ${userId} to Pro:`, error);
    throw error;
  }
}

module.exports = router;
