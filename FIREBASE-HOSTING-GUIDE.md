# Firebase Hosting Deployment Guide
## Deploy RATIX to Your Custom Domain - FREE Forever

Firebase Hosting is Google's free, fast, and secure web hosting solution. Perfect for your RATIX game!

---

## Why Firebase Hosting?

✅ **100% FREE** (generous free tier: 10GB storage, 360MB/day bandwidth)
✅ **Lightning fast** (Google's global CDN)
✅ **Free SSL certificate** (automatic HTTPS)
✅ **Custom domain support** (connect your domain in minutes)
✅ **Already integrated** with your Firebase project
✅ **Easy deployment** (one command)
✅ **Automatic rollbacks** (if something breaks)

---

## Prerequisites

- Node.js installed (download from https://nodejs.org)
- Your custom domain purchased (from Squarespace, Namecheap, Google Domains, etc.)

---

## Step 1: Install Firebase CLI

Open your terminal/command prompt:

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Verify installation
firebase --version
```

---

## Step 2: Login to Firebase

```bash
# Login with your Google account
firebase login

# This will open a browser window
# Sign in with the same Google account used for your Firebase project
```

---

## Step 3: Initialize Your Project

Your project is already set up with `firebase.json` and `.firebaserc` files!

**What these files do:**
- `.firebaserc` - Links to your Firebase project (ratix-fbf35)
- `firebase.json` - Hosting configuration
  - Sets `website.html` as the homepage
  - Ignores unnecessary files
  - Configures caching for performance

---

## Step 4: Deploy to Firebase

```bash
# From your project directory (/home/user/ratix)
firebase deploy --only hosting

# You'll see:
# ✔ Deploy complete!
# Hosting URL: https://ratix-fbf35.web.app
```

**Your game is now live!** Visit: `https://ratix-fbf35.web.app`

---

## Step 5: Connect Your Custom Domain

### Option A: Domain from Squarespace

1. **In Firebase Console:**
   - Go to https://console.firebase.google.com
   - Select project: **ratix-fbf35**
   - Navigate to **Hosting** → **Add custom domain**
   - Enter your domain: `yourgame.com`
   - Copy the TXT record shown

2. **In Squarespace:**
   - Go to your Squarespace account
   - Navigate to **Domains** → **DNS Settings**
   - Click **Add Record** → **TXT Record**
   - Paste the TXT value from Firebase
   - Click **Save**

3. **Verify in Firebase:**
   - Click **Verify** in Firebase Console
   - Wait 5-30 minutes for DNS propagation

4. **Add A Records:**
   - Firebase will show you two IP addresses
   - In Squarespace DNS settings, add **A Records**:
     ```
     @ → 199.36.158.100
     @ → 199.36.158.101
     ```

5. **Add www subdomain (optional):**
   - In Squarespace, add a **CNAME record**:
     ```
     www → ratix-fbf35.web.app
     ```

### Option B: Domain from Namecheap

1. **In Firebase Console:**
   - Add custom domain as above
   - Copy TXT record

2. **In Namecheap:**
   - Go to **Domain List** → **Manage** → **Advanced DNS**
   - Add **TXT Record**:
     ```
     Host: @
     Value: [paste from Firebase]
     TTL: Automatic
     ```

3. **Add A Records:**
   ```
   Host: @
   Value: 199.36.158.100
   TTL: Automatic

   Host: @
   Value: 199.36.158.101
   TTL: Automatic
   ```

4. **Add CNAME for www:**
   ```
   Host: www
   Value: ratix-fbf35.web.app
   TTL: Automatic
   ```

### Option C: Domain from Google Domains

1. **In Firebase Console:**
   - Add custom domain
   - Copy records

2. **In Google Domains:**
   - Go to **DNS** → **Custom records**
   - Add records exactly as Firebase instructs
   - Google Domains propagates fastest (5-15 minutes)

### DNS Propagation

- **Wait time**: 5 minutes to 48 hours (usually 15-30 minutes)
- **Check status**: https://www.whatsmydns.net
- **Firebase automatically provisions SSL** once DNS is verified

---

## Step 6: Update Your Website

After deploying, update placeholders in your files:

### In `website.html`:
```html
<!-- Find and replace: -->
yourdomain.com → your-actual-domain.com

<!-- Update Open Graph URLs: -->
<meta property="og:url" content="https://your-actual-domain.com/">
<meta property="og:image" content="https://your-actual-domain.com/assets/ratix-og-image.jpg">
```

### In `sitemap.xml`:
```xml
<!-- Replace all instances: -->
https://yourdomain.com/ → https://your-actual-domain.com/
```

### In `robots.txt`:
```
Sitemap: https://your-actual-domain.com/sitemap.xml
```

**Then redeploy:**
```bash
firebase deploy --only hosting
```

---

## Step 7: Test Your Deployment

Visit your domain and check:

1. ✅ **Website loads** at `https://yourgame.com`
2. ✅ **SSL works** (padlock icon in browser)
3. ✅ **Game plays** correctly
4. ✅ **Firebase features** work (login, high scores)
5. ✅ **www redirect** works: `https://www.yourgame.com`

---

## Step 8: Submit to Search Engines

### Google Search Console

1. **Go to**: https://search.google.com/search-console
2. **Add property**: Enter your domain
3. **Verify ownership**: Use TXT record method (same as Firebase)
4. **Submit sitemap**: `https://yourgame.com/sitemap.xml`

### Bing Webmaster Tools

1. **Go to**: https://www.bing.com/webmasters
2. **Add site**: Enter your domain
3. **Verify**: Import from Google Search Console (easiest)
4. **Submit sitemap**: `https://yourgame.com/sitemap.xml`

---

## Continuous Deployment

### Deploy Updates

Every time you make changes:

```bash
# Deploy everything
firebase deploy

# Or deploy only hosting (faster)
firebase deploy --only hosting
```

### View Deploy History

```bash
firebase hosting:channel:list
```

### Rollback to Previous Version

```bash
# In Firebase Console
# Hosting → Release history → Click "..." → Rollback
```

---

## Performance Optimization

Your `firebase.json` already includes:

✅ **Cache-Control headers** (static assets cached for 1 year)
✅ **HTML cached** for 1 hour
✅ **Clean URLs** (no .html extensions)
✅ **Gzip compression** (automatic)

### Additional Optimizations

1. **Compress images** (use TinyPNG or ImageOptim)
2. **Minify JavaScript** (if you add custom JS)
3. **Use WebP images** for better compression
4. **Enable HTTP/2 Server Push** (advanced)

---

## Monitoring & Analytics

### Firebase Hosting Analytics

In Firebase Console → Hosting → Usage:
- See bandwidth usage
- Monitor request counts
- Check data transfer

### Google Analytics

Already included in `website.html`! Just update:

```javascript
// Replace with your GA4 Measurement ID
gtag('config', 'G-XXXXXXXXXX');
```

Get your ID from: https://analytics.google.com

---

## Costs & Limits

### Free Tier (Spark Plan)
- **Storage**: 10 GB
- **Transfer**: 360 MB/day (~10 GB/month)
- **Custom domain**: FREE
- **SSL certificate**: FREE

### If You Exceed Free Tier

Upgrade to **Blaze Plan** (pay-as-you-go):
- **Storage**: $0.026/GB/month
- **Transfer**: $0.15/GB
- **No minimum fee**

**Example costs:**
- 1,000 visitors/day = $0-5/month
- 10,000 visitors/day = $10-30/month

**Way cheaper than Squarespace ($23/month)!**

---

## Troubleshooting

### Issue: Domain not connecting
**Solution:**
- Wait 24-48 hours for DNS propagation
- Use https://www.whatsmydns.net to check DNS status
- Verify A records point to correct IPs

### Issue: SSL certificate pending
**Solution:**
- Wait for DNS to fully propagate
- Firebase auto-provisions SSL (can take up to 24 hours)
- Check status in Firebase Console → Hosting

### Issue: 404 errors
**Solution:**
- Ensure `website.html` exists in project root
- Check `firebase.json` rewrite rules
- Redeploy: `firebase deploy --only hosting`

### Issue: Firebase Authentication not working
**Solution:**
- Add your custom domain to Firebase Auth → Authorized domains
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Click "Add domain" → Enter your domain

---

## Security Best Practices

1. **Never commit secrets** to git
2. **Use environment variables** for API keys
3. **Configure Firestore security rules** (see MONETIZATION-GUIDE.md)
4. **Enable Firebase App Check** (protects against abuse)
5. **Monitor Firebase Console** for unusual activity

---

## Advanced: Custom Domain Email

With your domain, you can create professional email addresses:

**Options:**
1. **Google Workspace** ($6/month) - `contact@yourgame.com`
2. **Zoho Mail** (FREE for 5 users) - `support@yourgame.com`
3. **ProtonMail** ($4/month) - Privacy-focused

---

## Quick Reference Commands

```bash
# Login
firebase login

# Deploy
firebase deploy --only hosting

# View logs
firebase hosting:channel:list

# Open Firebase Console
firebase open

# Test locally before deploying
firebase serve
# Then visit: http://localhost:5000
```

---

## Next Steps After Deployment

1. ✅ Deploy to Firebase Hosting
2. ✅ Connect custom domain
3. ✅ Submit to search engines
4. ✅ Set up Google Analytics
5. ✅ Apply for Google AdSense
6. ✅ Implement paid Supreme variant (see MONETIZATION-GUIDE.md)
7. ✅ Create social media accounts
8. ✅ Start marketing your game!

---

## Support Resources

- **Firebase Hosting Docs**: https://firebase.google.com/docs/hosting
- **Custom Domain Setup**: https://firebase.google.com/docs/hosting/custom-domain
- **Firebase Support**: https://firebase.google.com/support
- **Community**: https://stackoverflow.com/questions/tagged/firebase-hosting

---

## Summary

**Total Cost Breakdown:**

| Item | Cost | Notes |
|------|------|-------|
| Domain | $12/year | From any registrar |
| Firebase Hosting | FREE | Up to 10GB storage, 360MB/day |
| SSL Certificate | FREE | Automatic via Firebase |
| **Total** | **$12/year** | **$1/month!** |

Compare to:
- Squarespace: $276/year ($23/month)
- Wix: $192/year ($16/month)
- Traditional hosting: $120-300/year

**You save $180-264/year with Firebase!** 🎉

---

**Ready to deploy?** Run `firebase deploy --only hosting` and your game goes live!

**Questions?** Check the troubleshooting section or Firebase documentation.

**Good luck! 🚀**
