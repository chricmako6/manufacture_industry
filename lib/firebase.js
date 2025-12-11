"use client";

// Uses the Firebase Modular SDK (v9+). Make sure the `firebase` package
// is installed (run `npm install firebase` or `yarn add firebase`).
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Re-export commonly used auth helpers/providers so other modules can import
// them from '@/lib/firebase' instead of 'firebase/auth'. This keeps imports
// centralized and avoids repeated imports across components.
export { GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Return the initialized Auth instance
export function getFirebaseAuth() {
  return getAuth(app);
}

// Also export the default `auth` instance in case some code imports it directly
export const auth = getAuth(app);