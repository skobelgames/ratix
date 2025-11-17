# Ratix Firebase Setup Guide

This guide will help you set up and deploy the Ratix game application using Firebase.

## Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- A Firebase account

## Initial Setup

### 1. Install Node.js (if not already installed)

Download and install Node.js from: https://nodejs.org/

Verify installation by opening Command Prompt and running:
```cmd
node --version
npm --version
```

### 2. Install Firebase Tools

You have two options:

#### Option A: Install Locally (Recommended)
```cmd
npm install
```

Then use Firebase commands via npm:
```cmd
npm run firebase -- --help
npm run deploy
npm run serve
```

#### Option B: Install Globally
```cmd
npm install -g firebase-tools
```

Then use Firebase commands directly:
```cmd
firebase --help
firebase deploy
firebase serve
```

### 3. Login to Firebase

```cmd
npm run login
```

Or if installed globally:
```cmd
firebase login
```

This will open a browser window for you to authenticate with your Google account.

### 4. Verify Project Configuration

The project is already configured for the Firebase project `ratix-fbf35`. You can verify this by checking the `.firebaserc` file.

## Available Commands

### Using npm scripts (if installed locally):
- `npm run firebase -- <command>` - Run any Firebase CLI command
- `npm run deploy` - Deploy your application to Firebase Hosting
- `npm run serve` - Run a local development server
- `npm run login` - Login to Firebase

### Using global installation:
- `firebase deploy` - Deploy your application
- `firebase serve` - Run local development server
- `firebase deploy --only hosting` - Deploy only hosting
- `firebase deploy --only firestore:rules` - Deploy only Firestore rules
- `firebase deploy --only storage:rules` - Deploy only Storage rules

## Firebase Configuration

The application is configured to use:
- **Firebase Hosting**: Serves the game application
- **Firebase Authentication**: User authentication
- **Cloud Firestore**: Database for game data
- **Cloud Storage**: Storage for user assets

### Firebase Project Details
- Project ID: `ratix-fbf35`
- Auth Domain: `ratix-fbf35.firebaseapp.com`
- Storage Bucket: `ratix-fbf35.firebasestorage.app`

## Deployment

To deploy the application to Firebase Hosting:

1. Make sure you're logged in:
   ```cmd
   npm run login
   ```

2. Deploy the application:
   ```cmd
   npm run deploy
   ```

3. Your application will be available at: https://ratix-fbf35.web.app

## Local Development

To test locally before deploying:

```cmd
npm run serve
```

Then open http://localhost:5000 in your browser.

## Security Rules

The project includes security rules for:

- **Firestore** (`firestore.rules`): Controls database access
- **Storage** (`storage.rules`): Controls file storage access

These rules are deployed automatically with `firebase deploy`, or you can deploy them separately:

```cmd
npm run firebase -- deploy --only firestore:rules
npm run firebase -- deploy --only storage:rules
```

## Troubleshooting

### "firebase is not recognized" error

This error means Firebase tools aren't installed or not in your PATH. Solutions:

1. **Install locally** (recommended):
   ```cmd
   npm install
   ```
   Then use `npm run <command>` instead of `firebase <command>`

2. **Install globally**:
   ```cmd
   npm install -g firebase-tools
   ```

3. **Restart your terminal/command prompt** after installation

### Permission errors

If you get permission errors on Windows, try:
- Running Command Prompt as Administrator
- Or use the local installation method (Option A above)

### Login issues

If `firebase login` doesn't work:
```cmd
firebase login --no-localhost
```

## Project Structure

```
ratix/
├── game-code           # Main HTML game file
├── package.json        # Node.js dependencies and scripts
├── firebase.json       # Firebase hosting configuration
├── .firebaserc         # Firebase project configuration
├── firestore.rules     # Firestore security rules
├── firestore.indexes.json # Firestore indexes
├── storage.rules       # Storage security rules
└── SETUP.md           # This file
```

## Next Steps

1. Complete the initial setup steps above
2. Test locally with `npm run serve`
3. Deploy to Firebase with `npm run deploy`
4. Configure your Firebase console at: https://console.firebase.google.com/project/ratix-fbf35

## Support

For Firebase documentation, visit: https://firebase.google.com/docs
