# RATIX Monetization Guide
## Google AdSense + Paid Supreme Variant Implementation

This guide covers how to monetize your RATIX game through Google AdSense advertising and implementing a paid 36's Supreme variant using Stripe payments.

---

## Part 1: Google AdSense Setup

### Step 1: Apply for Google AdSense

1. **Go to**: https://www.google.com/adsense/start/
2. **Sign up** with your Google account
3. **Enter your website URL**: `yourdomain.com`
4. **Wait for approval** (typically 1-2 weeks)

### Step 2: Get Your AdSense Code

Once approved:
1. Go to **AdSense Dashboard** → **Ads** → **Overview**
2. Click **Get code** for your ad units
3. Copy your **Publisher ID** (looks like: `ca-pub-1234567890123456`)

### Step 3: Update website.html

Replace all instances of `ca-pub-XXXXXXXXXXXXXXXX` in `website.html` with your actual Publisher ID.

**Find and replace:**
```html
<!-- Before -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"

<!-- After -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
```

### Step 4: Create Ad Units in AdSense

Create these ad unit sizes in your AdSense dashboard:

1. **Top Banner**: 728x90 Leaderboard
2. **Side Banners**: 160x600 Skyscraper (x2)
3. **Bottom Rectangle**: 336x280 Large Rectangle

For each ad unit, copy the `data-ad-slot` ID and update in `website.html`.

### Step 5: AdSense Placement Strategy

**Current placements in website.html:**
- ✅ Top banner (high visibility)
- ✅ Left sidebar (desktop only)
- ✅ Right sidebar (desktop only)
- ✅ Bottom rectangle (after game)

**Best practices:**
- Don't place ads inside the game iframe
- Keep ads above the fold when possible
- Maximum 3-4 ad units per page for better revenue
- Test different placements with AdSense experiments

### Expected Revenue

Based on typical gaming website metrics:
- **1,000 daily visitors** = $5-15/day ($150-450/month)
- **5,000 daily visitors** = $25-75/day ($750-2,250/month)
- **10,000 daily visitors** = $50-150/day ($1,500-4,500/month)

*Note: Actual revenue varies by traffic quality, geographic location, and niche.*

---

## Part 2: Paid Supreme Variant Implementation

### Overview

Gate the "36's (Supreme)" variant behind a one-time payment of $4.99 using:
- **Firebase Authentication** (already integrated)
- **Stripe Checkout** (payment processing)
- **Firestore** (track purchases)

### Step 1: Set Up Stripe Account

1. **Sign up**: https://stripe.com
2. **Activate account** (provide business details)
3. **Get API keys**: Dashboard → Developers → API keys
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...` (keep secret!)

### Step 2: Install Stripe Firebase Extension

Firebase has an official Stripe extension that handles payments automatically.

**Install via Firebase Console:**
```bash
1. Go to Firebase Console → Extensions
2. Search for "Run Payments with Stripe"
3. Click Install
4. Enter your Stripe Secret Key
5. Configure:
   - Products and pricing collection: products
   - Customer collection: customers
   - Sync new users: Yes
```

**Or install via CLI:**
```bash
firebase ext:install stripe/firestore-stripe-payments
```

### Step 3: Create Supreme Product in Stripe

In your Stripe Dashboard:

1. **Products** → **Add Product**
2. **Name**: "RATIX 36's Supreme Variant"
3. **Description**: "Unlock the ultimate RATIX experience with experimental spellcraft, Huntsmen units, and advanced tactics"
4. **Price**: $4.99 (one-time payment)
5. **Copy Product ID**: `prod_xxxxx`
6. **Copy Price ID**: `price_xxxxx`

### Step 4: Modify Game Code for Paywall

I'll create a modified version of your game with the Supreme variant locked.

**Key changes needed in `index.html`:**

#### A. Add Stripe SDK (in `<head>`)
```html
<script src="https://js.stripe.com/v3/"></script>
```

#### B. Add Purchase Status Check (after Firebase init)
```javascript
// Track Supreme variant purchase status
let hasSupremeAccess = false;

// Check if user has purchased Supreme
async function checkSupremeAccess() {
    if (!currentUser) return false;

    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    if (userDoc.exists) {
        const userData = userDoc.data();
        hasSupremeAccess = userData.hasSupremeAccess || false;
    }
    return hasSupremeAccess;
}

// Initialize and check access
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        await checkSupremeAccess();
        updateSupremeButton();
    }
});
```

#### C. Modify Supreme Variant Button
```javascript
// Find this line in game-code (around line 2828):
<button id="variant-btn-36s-supreme" data-ready="false" onclick="handleVariantClick('36s-supreme')">36's (Supreme)</button>

// Replace with:
<button id="variant-btn-36s-supreme" data-ready="false" onclick="handleSupremeClick()">
    <span id="supreme-btn-text">36's (Supreme) - $4.99 🔒</span>
</button>
```

#### D. Add Payment Handler
```javascript
// Handle Supreme variant click
async function handleSupremeClick() {
    // Check if user already has access
    await checkSupremeAccess();

    if (hasSupremeAccess) {
        // User has purchased, allow access
        handleVariantClick('36s-supreme');
        return;
    }

    // Show payment dialog
    if (confirm('Unlock 36\'s Supreme variant for $4.99?\n\n• Experimental spellcraft\n• Huntsmen units\n• Advanced dark magic\n• Ultimate tactical experience')) {
        await initiateSupremePurchase();
    }
}

// Initiate Stripe Checkout
async function initiateSupremePurchase() {
    try {
        if (!currentUser) {
            alert('Please wait for authentication to complete.');
            return;
        }

        // Create Stripe checkout session via Firebase
        const checkoutSessionRef = await db
            .collection('customers')
            .doc(currentUser.uid)
            .collection('checkout_sessions')
            .add({
                price: 'price_xxxxx', // Replace with your Stripe Price ID
                success_url: window.location.origin + '?supreme=success',
                cancel_url: window.location.origin + '?supreme=cancelled',
                mode: 'payment',
                metadata: {
                    product: 'supreme_variant'
                }
            });

        // Wait for Stripe Checkout URL
        checkoutSessionRef.onSnapshot((snap) => {
            const { error, url } = snap.data();
            if (error) {
                alert('Payment error: ' + error.message);
            }
            if (url) {
                window.location.assign(url);
            }
        });

    } catch (error) {
        console.error('Purchase error:', error);
        alert('Failed to initiate purchase. Please try again.');
    }
}

// Update button text based on access
function updateSupremeButton() {
    const btn = document.getElementById('supreme-btn-text');
    if (btn) {
        if (hasSupremeAccess) {
            btn.textContent = '36\'s (Supreme) ✅';
            document.getElementById('variant-btn-36s-supreme').style.background = '#4CAF50';
        } else {
            btn.textContent = '36\'s (Supreme) - $4.99 🔒';
        }
    }
}

// Check URL for payment success
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('supreme') === 'success') {
        // Payment successful
        alert('🎉 Supreme variant unlocked! Enjoy the ultimate RATIX experience!');
        checkSupremeAccess();
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
```

#### E. Set Up Firestore Webhook (Automatic)

The Stripe extension automatically:
1. Creates customer records in Firestore
2. Records successful payments
3. Triggers Cloud Functions on purchase

**Create a Cloud Function** to grant Supreme access:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onStripePaymentSuccess = functions.firestore
    .document('customers/{userId}/payments/{paymentId}')
    .onCreate(async (snap, context) => {
        const payment = snap.data();
        const userId = context.params.userId;

        // Check if payment is for Supreme variant
        if (payment.status === 'succeeded' && payment.metadata?.product === 'supreme_variant') {
            // Grant Supreme access
            await admin.firestore().collection('users').doc(userId).set({
                hasSupremeAccess: true,
                supremePurchaseDate: admin.firestore.FieldValue.serverTimestamp(),
                supremePaymentId: context.params.paymentId
            }, { merge: true });

            console.log(`Supreme access granted to user: ${userId}`);
        }
    });
```

**Deploy the function:**
```bash
firebase deploy --only functions
```

### Step 5: Firestore Security Rules

Update Firestore rules to protect purchase data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // User data - owner only
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Prevent users from granting themselves Supreme access
      allow update: if request.auth != null
                    && request.auth.uid == userId
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['hasSupremeAccess']);
    }

    // Stripe customer data - owner only
    match /customers/{userId} {
      allow read: if request.auth.uid == userId;

      match /checkout_sessions/{id} {
        allow read, write: if request.auth.uid == userId;
      }
      match /payments/{id} {
        allow read: if request.auth.uid == userId;
      }
    }

    // Other rules...
  }
}
```

### Step 6: Testing

**Test mode:**
1. Use Stripe **test keys** (pk_test_... and sk_test_...)
2. Use test card: `4242 4242 4242 4242`, any future date, any CVC
3. Verify purchase grants access
4. Check Firestore for user record update

**Production:**
1. Switch to **live keys**
2. Test with real payment (refund yourself)
3. Monitor Stripe Dashboard for transactions

---

## Part 3: Revenue Projections

### Combined Revenue Model

**Scenario 1: Small Audience (1,000 daily visitors)**
- AdSense: $150-450/month
- Supreme sales: 20 purchases/month × $4.99 = $99.80/month
- **Total: $250-550/month**

**Scenario 2: Medium Audience (5,000 daily visitors)**
- AdSense: $750-2,250/month
- Supreme sales: 100 purchases/month × $4.99 = $499/month
- **Total: $1,250-2,750/month**

**Scenario 3: Large Audience (10,000 daily visitors)**
- AdSense: $1,500-4,500/month
- Supreme sales: 250 purchases/month × $4.99 = $1,247.50/month
- **Total: $2,750-5,750/month**

### Conversion Rate Optimization

**Typical conversion rates for paid game features: 2-5%**

Ways to increase conversions:
- Offer a free trial of Supreme (first game only)
- Bundle with other premium features
- Create urgency (limited-time discount)
- Show Supreme-only features in demo videos
- Testimonials from Supreme players

---

## Part 4: SEO for Discovery

Your `website.html` already includes SEO optimization, but here's how to maximize discovery:

### Essential SEO Tasks

1. **Submit to Google Search Console**
   - Verify your domain
   - Submit sitemap.xml (see next section)
   - Monitor search performance

2. **Submit to Bing Webmaster Tools**
   - Same process as Google
   - Different audience reach

3. **Create High-Quality Content**
   - Strategy guides
   - How-to-play tutorials
   - Game variant comparisons
   - Blog posts about chess variants

4. **Build Backlinks**
   - Submit to game directories
   - Reddit communities (r/boardgames, r/chess)
   - Chess forums
   - Strategy game websites

5. **Social Media**
   - YouTube gameplay videos
   - Twitter/X updates
   - Discord community
   - Twitch streams

---

## Part 5: Legal Requirements

### Required Pages

Create these pages for AdSense compliance:

1. **Privacy Policy** (`privacy.html`)
   - Data collection disclosure
   - Cookie usage
   - Third-party advertising
   - User rights (GDPR/CCPA)

2. **Terms of Service** (`terms.html`)
   - Usage rules
   - Refund policy
   - Account termination
   - Liability limitations

3. **Contact Page** (`contact.html`)
   - Support email
   - Business address (for AdSense)

### Payment Processing Compliance

- **PCI Compliance**: Stripe handles this automatically
- **Refund Policy**: Clearly state your policy (recommend 7-day refund window)
- **Tax Collection**: Stripe can handle sales tax automatically

---

## Quick Start Checklist

### Immediate (Week 1)
- [ ] Deploy website.html to your domain
- [ ] Apply for Google AdSense
- [ ] Create Stripe account
- [ ] Add Privacy Policy and Terms pages

### Short Term (Week 2-4)
- [ ] Get AdSense approval
- [ ] Add AdSense codes to website
- [ ] Install Stripe Firebase Extension
- [ ] Create Supreme product in Stripe
- [ ] Test payment flow

### Medium Term (Month 2-3)
- [ ] Implement Supreme paywall in game
- [ ] Deploy Cloud Function for access grants
- [ ] Submit to Google Search Console
- [ ] Create social media accounts
- [ ] Start content marketing

### Long Term (Month 4+)
- [ ] Analyze AdSense performance
- [ ] Optimize ad placements
- [ ] A/B test pricing ($3.99 vs $4.99 vs $5.99)
- [ ] Add more paid features (skins, tournaments, etc.)
- [ ] Build community

---

## Support Resources

- **Google AdSense**: https://support.google.com/adsense
- **Stripe Documentation**: https://stripe.com/docs
- **Firebase Extensions**: https://firebase.google.com/products/extensions
- **Firebase Cloud Functions**: https://firebase.google.com/docs/functions

---

## Next Steps

1. **Review** the implementation code above
2. **Test** the payment flow in Stripe test mode
3. **Deploy** with live keys when ready
4. **Monitor** revenue and optimize

**Questions or need help implementing?** Refer to the code snippets above or consult Firebase/Stripe documentation.

---

**Good luck with your RATIX monetization! 🚀**
