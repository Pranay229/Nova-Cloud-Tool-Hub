import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId &&
    firebaseConfig.apiKey !== 'dev-api-key' &&
    firebaseConfig.apiKey.startsWith('AIza') // Firebase API keys start with 'AIza'
  );
};

// Initialize Firebase app lazily
function getFirebaseApp() {
  if (getApps().length === 0) {
    if (!isFirebaseConfigured()) {
      if (import.meta.env.MODE === 'development') {
        console.warn(
          '⚠️ Firebase is not configured. Please create a .env file with your Firebase credentials.\n' +
          'Required variables:\n' +
          '  VITE_FIREBASE_API_KEY\n' +
          '  VITE_FIREBASE_AUTH_DOMAIN\n' +
          '  VITE_FIREBASE_PROJECT_ID\n' +
          '  VITE_FIREBASE_STORAGE_BUCKET\n' +
          '  VITE_FIREBASE_MESSAGING_SENDER_ID\n' +
          '  VITE_FIREBASE_APP_ID\n' +
          '\nAuthentication features will not work until Firebase is configured.'
        );
        // Return a mock app object to prevent crashes
        return null as any;
      } else {
        throw new Error(
          'Firebase configuration is missing. Please set all required environment variables.'
        );
      }
    }
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

let firebaseApp: ReturnType<typeof getFirebaseApp> | null = null;

try {
  firebaseApp = getFirebaseApp();
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  firebaseApp = null;
}

// Export Firebase services only if configured
export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null as any;
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null as any;
export const firebaseStorage = firebaseApp ? getStorage(firebaseApp) : null as any;

// Initialize Analytics (only in browser environment)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (firebaseApp && typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp!);
    }
  });
}

export { analytics };
export default firebaseApp;

