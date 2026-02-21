
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../constants';

// Basic safety check for environment variables
if (!FIREBASE_CONFIG.apiKey) {
  console.warn("Firebase API Key is missing. Check your environment variables / .env file.");
}

// Initialize Firebase with modular SDK
const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);

// Using standard Firestore initialization to resolve export member issues
export const db = getFirestore(app);

export const auth = getAuth(app);
