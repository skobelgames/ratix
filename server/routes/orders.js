const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const paypal = require('@paypal/checkout-server-sdk');
const { db } = require('../config/firebase');

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize PayPal
const paypalEnvironment = process.env.PAYPAL_MODE === 'production'
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const paypalClient = new paypal.core.PayPalHttpClient(paypalEnvironment);

/**
 * POST /api/orders/create-stripe-checkout
 * Create a Stripe checkout session for Pro upgrade
 */
router.post('/create-stripe-checkout', async (req, res) => {
  try {
    const { userId, email, username } = req.body;

    // Validate input
    if (!userId || !email) {
      return res.status(400).json({ error: 'Missing required fields: userId, email' });
    }

    // Create order record in Firestore
    const orderRef = db.collection('orders').doc();
    const orderId = orderRef.id;

    const orderData = {
      orderId,
      userId,
      email,
      username: username || 'Unknown',
      provider: 'stripe',
      amount: 3.00,
      currency: 'gbp',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await orderRef.set(orderData);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'RATIX Pro Upgrade',
              description: 'Unlock all game variants and unlimited ranked games',
              images: ['https://ratix-fbf35.firebaseapp.com/icon-192.png']
            },
            unit_amount: 300 // £3.00 in pence
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}?payment=cancelled`,
      client_reference_id: orderId,
      customer_email: email,
      metadata: {
        orderId,
        userId,
        username: username || 'Unknown'
      }
    });

    // Update order with session ID
    await orderRef.update({
      stripeSessionId: session.id,
      updatedAt: new Date().toISOString()
    });

    res.json({
      sessionId: session.id,
      orderId,
      url: session.url
    });

  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/orders/create-paypal-order
 * Create a PayPal order for Pro upgrade
 */
router.post('/create-paypal-order', async (req, res) => {
  try {
    const { userId, email, username } = req.body;

    // Validate input
    if (!userId || !email) {
      return res.status(400).json({ error: 'Missing required fields: userId, email' });
    }

    // Create order record in Firestore
    const orderRef = db.collection('orders').doc();
    const orderId = orderRef.id;

    const orderData = {
      orderId,
      userId,
      email,
      username: username || 'Unknown',
      provider: 'paypal',
      amount: 3.00,
      currency: 'gbp',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await orderRef.set(orderData);

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          description: 'RATIX Pro Upgrade',
          custom_id: userId,
          amount: {
            currency_code: 'GBP',
            value: '3.00',
            breakdown: {
              item_total: {
                currency_code: 'GBP',
                value: '3.00'
              }
            }
          },
          items: [
            {
              name: 'RATIX Pro Upgrade',
              description: 'Unlock all game variants and unlimited ranked games',
              unit_amount: {
                currency_code: 'GBP',
                value: '3.00'
              },
              quantity: '1',
              category: 'DIGITAL_GOODS'
            }
          ]
        }
      ],
      application_context: {
        brand_name: 'RATIX',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}?payment=success`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}?payment=cancelled`
      }
    });

    const order = await paypalClient.execute(request);

    // Update order with PayPal order ID
    await orderRef.update({
      paypalOrderId: order.result.id,
      updatedAt: new Date().toISOString()
    });

    res.json({
      orderId: order.result.id,
      internalOrderId: orderId
    });

  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/orders/capture-paypal-order
 * Capture a PayPal order after user approval
 */
router.post('/capture-paypal-order', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' });
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await paypalClient.execute(request);

    res.json({
      status: capture.result.status,
      captureId: capture.result.id,
      details: capture.result
    });

  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/orders/:orderId
 * Get order details
 */
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderDoc = await db.collection('orders').doc(orderId).get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(orderDoc.data());

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
