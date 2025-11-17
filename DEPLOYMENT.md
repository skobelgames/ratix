# RATIX Game - Custom Domain Deployment Guide

This guide will help you deploy the RATIX game to your own website with a custom domain.

## Files Overview

- **`index.html`** - Main game file for standalone hosting
- **`ratix-game-embedded.html`** - Optimized version for iframe embedding
- **`game-code`** - Original game code (backup)

## Deployment Options

### Option 1: Standalone Page (Recommended)

Deploy `index.html` as a standalone game page on your website.

**Steps:**
1. Upload `index.html` to your web server
2. Access it directly: `https://yourdomain.com/index.html`
3. Or rename to desired path: `https://yourdomain.com/games/ratix.html`

**Example:**
```bash
# Via FTP, cPanel, or your hosting provider's file manager
/public_html/games/ratix.html  (upload index.html here)
```

### Option 2: Iframe Embedding

Embed the game into an existing page on your website.

**Steps:**
1. Upload `ratix-game-embedded.html` to your server
2. Add this iframe code to your main website page:

```html
<div style="width: 100%; display: flex; justify-content: center;">
    <iframe
        src="https://yourdomain.com/ratix-game-embedded.html"
        width="1320"
        height="900"
        frameborder="0"
        style="border: none; max-width: 100%;"
        allowfullscreen>
    </iframe>
</div>
```

**Responsive iframe (optional):**
```html
<div style="position: relative; padding-bottom: 68%; height: 0; overflow: hidden;">
    <iframe
        src="https://yourdomain.com/ratix-game-embedded.html"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
        allowfullscreen>
    </iframe>
</div>
```

### Option 3: Direct Integration

Copy the game code directly into your website's existing page structure.

1. Extract CSS from `<style>` tags in index.html → Add to your site's CSS
2. Extract JavaScript from `<script>` tags → Add to your site's JS files
3. Extract HTML body content → Add where you want the game to appear

## Firebase Configuration

### Important: Configure Authorized Domains

Your Firebase project needs to authorize your custom domain:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ratix-fbf35**
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add your custom domain: `yourdomain.com`
6. Also add with www if applicable: `www.yourdomain.com`

### Current Firebase Configuration

The game is configured with:
```javascript
apiKey: "AIzaSyBHnqv6ZsBmaUwjKH4W2FSno8nAwPrvTx8"
authDomain: "ratix-fbf35.firebaseapp.com"
projectId: "ratix-fbf35"
storageBucket: "ratix-fbf35.firebasestorage.app"
messagingSenderId: "225993624600"
appId: "1:225993624600:web:83e5b381acede64d6f476d"
```

This configuration is **publicly visible** in the HTML and is safe to expose. Firebase security is handled by Firestore Security Rules.

### Firestore Security Rules

Make sure your Firestore rules are properly configured to allow access from any domain:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // High scores - read/write for authenticated users
    match /highScores/{score} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Games - authenticated users only
    match /games/{gameId} {
      allow read, write: if request.auth != null;
    }

    // Users - owner only
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Upload Methods

### Via FTP/SFTP
```bash
# Using FileZilla, Cyberduck, or command line
sftp user@yourdomain.com
put index.html /public_html/games/ratix.html
```

### Via cPanel File Manager
1. Log into cPanel
2. Open File Manager
3. Navigate to `public_html` (or your web root)
4. Upload `index.html`
5. Rename if needed

### Via Git/GitHub
```bash
# If your website uses Git deployment
git add index.html
git commit -m "Add RATIX game"
git push origin main
```

### Via Cloud Hosting (Netlify, Vercel, etc.)
1. Drag and drop `index.html` to their web interface
2. Or connect your Git repository
3. Set custom domain in hosting settings

## Testing After Deployment

1. **Visit your game URL** in a browser
2. **Open browser console** (F12) and check for errors
3. **Test Firebase features:**
   - Anonymous login should work automatically
   - High scores should save
   - Online multiplayer should connect

## Troubleshooting

### Issue: Firebase Authentication Error
**Solution:** Add your domain to Firebase Authorized domains (see above)

### Issue: Game doesn't load
**Solution:** Check browser console for errors. Ensure all Firebase CDN scripts are loading.

### Issue: CORS errors
**Solution:** Serve the HTML file from your domain, not opening it locally (file://)

### Issue: Styles broken
**Solution:** Ensure the entire HTML file is uploaded correctly, including all `<style>` tags

## Performance Tips

1. **Enable gzip compression** on your web server for faster loading
2. **Use CDN** if your hosting supports it
3. **Browser caching** - Configure your server to cache the HTML file
4. **HTTPS** - Always use HTTPS for Firebase to work properly

## Next Steps

1. Upload your chosen file to your web server
2. Configure Firebase authorized domains
3. Test the game thoroughly
4. Share the URL with your players!

## Support

If you encounter issues:
- Check Firebase Console for errors
- Review browser console logs
- Ensure your domain is authorized in Firebase
- Verify your web server serves the file correctly

---

**Your Game is Ready to Deploy!** 🎮

Choose your preferred deployment method and follow the steps above.
