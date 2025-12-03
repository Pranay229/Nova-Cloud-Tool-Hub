import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app lazily
function getFirebaseApp() {
  if (getApps().length === 0) {
    // Only initialize if we have at least some config values
    // In development, allow partial config
    if (import.meta.env.MODE === 'development') {
      // Use default/placeholder values if missing in dev
      const config = {
        apiKey: firebaseConfig.apiKey || 'dev-api-key',
        authDomain: firebaseConfig.authDomain || 'dev.firebaseapp.com',
        projectId: firebaseConfig.projectId || 'dev-project',
        storageBucket: firebaseConfig.storageBucket || 'dev-project.appspot.com',
        messagingSenderId: firebaseConfig.messagingSenderId || '123456789',
        appId: firebaseConfig.appId || '1:123456789:web:dev',
      };
      return initializeApp(config);
    } else {
      // In production, require all values
      return initializeApp(firebaseConfig);
    }
  }
  return getApp();
}

const firebaseApp = getFirebaseApp();

export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
export default firebaseApp;

