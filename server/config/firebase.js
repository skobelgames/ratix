const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// In production, use service account key file or Application Default Credentials
let firebaseApp;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Parse service account from environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Use service account file path
    firebaseApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  } else {
    // Development fallback - initialize with project ID only
    console.warn('⚠️  No Firebase credentials provided. Using project ID only.');
    console.warn('⚠️  Set FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS for production.');
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'ratix-fbf35'
    });
  }

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
  throw error;
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth
};
