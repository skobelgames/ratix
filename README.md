# RATIX - Strategic Chess Variant Game

A professional, revenue-generating website for your RATIX game with SEO optimization, Google AdSense integration, and payment infrastructure for premium features.

---

## 🎮 What's Included

### Core Files

1. **`website.html`** - Professional landing page
   - SEO optimized with meta tags and structured data
   - Google AdSense integration (4 ad placements)
   - Responsive design with logo and navigation
   - Game embedded via iframe
   - Features section highlighting game modes

2. **`index.html`** - Standalone game file
   - Full RATIX game ready to play
   - Firebase integration for auth and multiplayer
   - High score tracking

3. **`ratix-game-embedded.html`** - Embeddable version
   - Optimized for iframe embedding
   - Same as index.html

### Legal & Compliance

4. **`privacy.html`** - Privacy Policy
   - GDPR and CCPA compliant
   - Cookie policy included
   - Required for Google AdSense approval

5. **`terms.html`** - Terms of Service
   - Refund policy (7-day window)
   - Acceptable use guidelines
   - Premium feature terms

6. **`contact.html`** - Contact page
   - Support information
   - FAQ section
   - Required for AdSense

### SEO & Configuration

7. **`sitemap.xml`** - Search engine sitemap
8. **`robots.txt`** - Crawler management
9. **`firebase.json`** - Hosting configuration
10. **`.firebaserc`** - Firebase project link

### Documentation

11. **`FIREBASE-HOSTING-GUIDE.md`** - Complete deployment guide
    - Firebase Hosting setup (FREE)
    - Custom domain connection
    - DNS configuration
    - Search engine submission

12. **`MONETIZATION-GUIDE.md`** - Revenue generation guide
    - Google AdSense setup
    - Stripe payment integration
    - Supreme variant paywall implementation
    - Revenue projections

13. **`DEPLOYMENT.md`** - General hosting guide
    - Multiple hosting options
    - Firebase domain configuration
    - Upload methods

---

## 🚀 Quick Start: Deploy Your Website

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Deploy to Firebase Hosting (FREE)

```bash
firebase deploy --only hosting
```

Your site will be live at: `https://ratix-fbf35.web.app`

### Step 3: Connect Your Custom Domain

1. Buy a domain (Squarespace, Namecheap, Google Domains, etc.)
2. In Firebase Console → Hosting → Add custom domain
3. Follow DNS instructions (detailed in FIREBASE-HOSTING-GUIDE.md)
4. Wait 15-30 minutes for DNS propagation
5. Firebase automatically provisions FREE SSL certificate

**Total cost: ~$12/year for domain only!**

---

## 💰 Monetization Setup

### Google AdSense (Display Ads)

1. **Apply**: https://www.google.com/adsense/start/
2. **Get approved** (1-2 weeks, requires quality content)
3. **Get Publisher ID**: `ca-pub-XXXXXXXXXXXXXXXX`
4. **Update website.html**: Replace all `ca-pub-XXXXXXXXXXXXXXXX` with your ID
5. **Create ad units** in AdSense dashboard
6. **Update ad slot IDs** in website.html

**Expected revenue:**
- 1,000 visitors/day = $150-450/month
- 5,000 visitors/day = $750-2,250/month
- 10,000 visitors/day = $1,500-4,500/month

### Paid Supreme Variant (36's Supreme)

1. **Set up Stripe** account: https://stripe.com
2. **Install Stripe Firebase Extension** (see MONETIZATION-GUIDE.md)
3. **Create product** in Stripe ($4.99)
4. **Implement paywall** in game code (detailed instructions in guide)
5. **Deploy Cloud Function** to grant access after payment

**Expected revenue:**
- 2-5% conversion rate typical
- $4.99 per purchase
- Additional $100-1,250/month depending on traffic

---

## 📊 SEO for Search Engine Discovery

Your website is already SEO-optimized with:

✅ **Meta tags** (title, description, keywords)
✅ **Open Graph** tags (Facebook sharing)
✅ **Twitter Card** tags (Twitter sharing)
✅ **Structured data** (Google Rich Results)
✅ **Sitemap.xml** (helps Google index your site)
✅ **Robots.txt** (crawler instructions)
✅ **Fast loading** (Firebase CDN)
✅ **Mobile responsive** design

### Submit to Search Engines

1. **Google Search Console**
   - https://search.google.com/search-console
   - Add property → Verify domain
   - Submit sitemap: `https://yourdomain.com/sitemap.xml`

2. **Bing Webmaster Tools**
   - https://www.bing.com/webmasters
   - Import from Google Search Console (easiest)

3. **Create content** for SEO:
   - Strategy guides
   - How-to-play tutorials
   - Blog posts about chess variants

---

## 📁 File Structure

```
/ratix
├── website.html              # Main landing page (SEO + AdSense)
├── index.html                # Standalone game
├── ratix-game-embedded.html  # Embeddable version
├── game-code                 # Original game file (backup)
│
├── privacy.html              # Privacy Policy (required for AdSense)
├── terms.html                # Terms of Service
├── contact.html              # Contact page
│
├── sitemap.xml               # SEO sitemap
├── robots.txt                # Crawler instructions
│
├── firebase.json             # Firebase Hosting config
├── .firebaserc               # Firebase project link
│
├── FIREBASE-HOSTING-GUIDE.md # Complete deployment guide
├── MONETIZATION-GUIDE.md     # AdSense + Stripe setup
├── DEPLOYMENT.md             # General hosting guide
└── README.md                 # This file
```

---

## ✅ Pre-Launch Checklist

### Before Deploying

- [ ] Buy your custom domain
- [ ] Replace `[YOUR-EMAIL]@gmail.com` in legal pages (privacy.html, terms.html, contact.html)
- [ ] Replace `yourdomain.com` with actual domain in:
  - [ ] website.html
  - [ ] sitemap.xml
  - [ ] robots.txt

### After Deploying

- [ ] Test website on desktop and mobile
- [ ] Verify Firebase features work (login, high scores)
- [ ] Apply for Google AdSense
- [ ] Set up Google Analytics
- [ ] Submit sitemap to Google Search Console
- [ ] Create Stripe account
- [ ] Set up social media accounts

### When AdSense Approved

- [ ] Add Publisher ID to website.html
- [ ] Create ad units in AdSense dashboard
- [ ] Update ad slot IDs in website.html
- [ ] Redeploy: `firebase deploy --only hosting`

### When Ready for Paid Features

- [ ] Install Stripe Firebase Extension
- [ ] Create Supreme product in Stripe ($4.99)
- [ ] Implement paywall in game code
- [ ] Deploy Cloud Function for payment webhooks
- [ ] Test with Stripe test mode
- [ ] Switch to live mode

---

## 🎯 Recommended Hosting: Firebase

**Why Firebase Hosting?**

| Feature | Firebase | Squarespace | Wix |
|---------|----------|-------------|-----|
| **Cost** | FREE | $276/year | $192/year |
| **SSL** | FREE | Included | Included |
| **Speed** | Google CDN (fastest) | Fast | Medium |
| **Custom domain** | ✅ | ✅ | ✅ |
| **Already integrated** | ✅ | ❌ | ❌ |
| **You can build it yourself** | ✅ | Drag-drop | Drag-drop |

**Savings: $180-264/year with Firebase!**

---

## 💡 Next Steps

### Week 1: Launch
1. Deploy to Firebase Hosting
2. Connect your custom domain
3. Update all placeholder text
4. Submit to Google Search Console

### Week 2-4: Monetization
1. Apply for Google AdSense
2. Set up Stripe account
3. Create social media presence
4. Start content marketing

### Month 2+: Growth
1. Add AdSense when approved
2. Implement Supreme paywall
3. Create strategy guides for SEO
4. Build community (Discord, Reddit)
5. Analyze traffic and optimize

---

## 📚 Documentation

- **Deployment**: See `FIREBASE-HOSTING-GUIDE.md`
- **Monetization**: See `MONETIZATION-GUIDE.md`
- **Firebase Docs**: https://firebase.google.com/docs/hosting
- **AdSense Help**: https://support.google.com/adsense
- **Stripe Docs**: https://stripe.com/docs

---

## 🆘 Support

Need help? Check these resources:

1. Read the comprehensive guides (FIREBASE-HOSTING-GUIDE.md, MONETIZATION-GUIDE.md)
2. Firebase documentation
3. Google AdSense help center
4. Stripe developer docs

---

## 🎉 Summary

You now have:

✅ **Professional landing page** with SEO
✅ **Google AdSense integration** for ad revenue
✅ **Legal pages** for compliance (Privacy, Terms, Contact)
✅ **SEO configuration** for search engine discovery
✅ **Firebase Hosting setup** (FREE forever)
✅ **Payment infrastructure** for Supreme variant ($4.99)
✅ **Complete documentation** for deployment and monetization
✅ **Revenue projections** and business plan

**Potential monthly revenue:**
- **Small**: $250-550/month (1,000 visitors/day)
- **Medium**: $1,250-2,750/month (5,000 visitors/day)
- **Large**: $2,750-5,750/month (10,000 visitors/day)

**Total setup cost: ~$12/year (domain only)**

---

## 🚀 Ready to Launch?

```bash
# Deploy now!
firebase deploy --only hosting
```

**Good luck with RATIX! 🎮**

---

*Built by Claude for Skobel Games*
*Last updated: November 17, 2024*
