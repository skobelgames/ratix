# RATIX Backend Server Setup Guide

This document provides instructions for setting up and running the RATIX backend server for payment processing.

## Overview

The backend server handles:
- Order creation for Pro upgrades
- Stripe payment processing and webhooks
- PayPal payment processing and webhooks
- Integration with Firebase Firestore for order and user management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Firestore enabled
- Stripe account (for credit card payments)
- PayPal Business account (for PayPal payments)

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# Firebase Configuration
FIREBASE_PROJECT_ID=ratix-fbf35
FIREBASE_DATABASE_URL=https://ratix-fbf35.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal Configuration
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

### 3. Firebase Admin Setup

**Option A: Service Account Key (Recommended)**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (ratix-fbf35)
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Convert to single-line JSON and add to `.env` as `FIREBASE_SERVICE_ACCOUNT_KEY`

**Option B: Service Account File**

Alternatively, save the service account file and set the path:

```env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

### 4. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your **Secret Key** from Developers > API Keys
3. Get your **Publishable Key** from Developers > API Keys
4. Set up a webhook endpoint:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
   - Copy the **Webhook Secret** (whsec_...)

5. Update the frontend Stripe key in `game-code`:
   ```javascript
   const stripe = Stripe('pk_test_YOUR_ACTUAL_KEY'); // Line 3323
   ```

### 5. PayPal Setup

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Create a REST API app
3. Get your **Client ID** and **Client Secret**
4. Set up webhooks:
   - Go to your app settings > Webhooks
   - Add webhook URL: `https://your-domain.com/api/webhooks/paypal`
   - Select events:
     - `CHECKOUT.ORDER.APPROVED`
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `PAYMENT.CAPTURE.REFUNDED`

5. Update the PayPal client ID in `game-code` (line 18):
   ```html
   <script src="https://www.paypal.com/sdk/js?client-id=YOUR_ACTUAL_CLIENT_ID&currency=GBP"></script>
   ```

## Running the Server

### Development Mode

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server on file changes.

### Production Mode

```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Order Creation

#### Stripe Checkout
- **POST** `/api/orders/create-stripe-checkout`
- Body:
  ```json
  {
    "userId": "firebase-uid",
    "email": "user@example.com",
    "username": "username"
  }
  ```
- Response:
  ```json
  {
    "sessionId": "cs_...",
    "orderId": "firestore-doc-id",
    "url": "https://checkout.stripe.com/..."
  }
  ```

#### PayPal Order
- **POST** `/api/orders/create-paypal-order`
- Body:
  ```json
  {
    "userId": "firebase-uid",
    "email": "user@example.com",
    "username": "username"
  }
  ```
- Response:
  ```json
  {
    "orderId": "paypal-order-id",
    "internalOrderId": "firestore-doc-id"
  }
  ```

#### Capture PayPal Order
- **POST** `/api/orders/capture-paypal-order`
- Body:
  ```json
  {
    "orderId": "paypal-order-id"
  }
  ```

#### Get Order
- **GET** `/api/orders/:orderId`
- Returns order details from Firestore

### Webhooks

#### Stripe Webhook
- **POST** `/api/webhooks/stripe`
- Handles Stripe events (signature verified)

#### PayPal Webhook
- **POST** `/api/webhooks/paypal`
- Handles PayPal events

## Firestore Schema

### Orders Collection

```javascript
{
  orderId: string,
  userId: string,
  email: string,
  username: string,
  provider: 'stripe' | 'paypal',
  amount: number,
  currency: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  createdAt: ISO string,
  updatedAt: ISO string,
  completedAt?: ISO string,

  // Stripe specific
  stripeSessionId?: string,
  stripePaymentIntentId?: string,

  // PayPal specific
  paypalOrderId?: string,
  paypalCaptureId?: string,

  // Additional data
  sessionData?: object,
  captureData?: object,
  failureReason?: string,
  refundedAt?: ISO string
}
```

### Users Collection (Updated Fields)

```javascript
{
  // ... existing fields
  isPro: boolean,
  proUpgradeDate: timestamp,
  paymentData: {
    provider: 'stripe' | 'paypal',
    transactionId: string,
    amount: number,
    currency: string,
    timestamp: number
  }
}
```

## Deployment

### Environment Variables for Production

Update these in your `.env` for production:

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-actual-domain.com
PAYPAL_MODE=production
```

### Deploy Options

**Option 1: Cloud Functions (Recommended for Firebase)**
- Convert endpoints to Firebase Cloud Functions
- Automatically scales and integrates with Firebase

**Option 2: Traditional Server**
- Deploy to any Node.js hosting (Heroku, DigitalOcean, AWS, etc.)
- Set up SSL certificate for HTTPS
- Configure webhook URLs in Stripe and PayPal dashboards

**Option 3: Serverless**
- Deploy to Vercel, Netlify Functions, or AWS Lambda
- Configure API routes accordingly

### Update Frontend URL

After deployment, update the API URL in `game-code` (line 3324):

```javascript
const API_BASE_URL = 'https://your-backend-domain.com/api';
```

## Testing

### Test Stripe Integration

1. Use Stripe test mode keys (pk_test_... and sk_test_...)
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date and any CVC

### Test PayPal Integration

1. Use PayPal sandbox credentials
2. Create test accounts in PayPal Developer Dashboard
3. Use sandbox accounts for testing

### Test Webhooks Locally

Use [ngrok](https://ngrok.com/) or [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks to localhost:

```bash
# Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# ngrok
ngrok http 3000
```

## Monitoring

Check server logs for:
- Payment events
- Order creation
- Webhook processing
- Errors and failures

## Troubleshooting

### Webhook Signature Verification Fails
- Ensure `STRIPE_WEBHOOK_SECRET` is correct
- Check that webhook URL is correct in Stripe dashboard
- Verify raw body is being passed to Stripe verification

### Orders Not Creating
- Check Firebase Admin credentials
- Verify Firestore rules allow server writes
- Check API request format

### PayPal Orders Failing
- Verify PayPal credentials (Client ID and Secret)
- Check PayPal mode (sandbox vs production)
- Ensure currency is supported (GBP)

## Security Considerations

1. **Never commit `.env` file** - it contains secrets
2. **Use HTTPS in production** - required for payment processing
3. **Validate webhook signatures** - prevents unauthorized requests
4. **Implement rate limiting** - prevents abuse
5. **Log all payment events** - for audit trail
6. **Use environment variables** - for all sensitive data

## Support

For issues:
1. Check server logs
2. Verify environment variables
3. Test with Stripe/PayPal test modes
4. Review Firestore security rules

## License

MIT
