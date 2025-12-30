"use client";

import { getFirebaseAuth, getFirestoreDb} from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

export const signup = async (email, password, displayName) => {
  try {
    const auth = getFirebaseAuth();
    
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with display name
    if (displayName) {
      await updateProfile(user, {
        displayName: displayName
      });
    }
    
    // IMPORTANT: Return the full userCredential, not just user
    return userCredential;
    
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const login = async (email, password) => {
  const auth = getFirebaseAuth();
  return await signInWithEmailAndPassword(auth, email, password);
};

export const checkUserStatus = async (user) => {
  /**
   * Returns { verified: boolean, approved: boolean }
   * Helps determine where to redirect user after login
   */
  if (!user) return null;
  
  const db = getFirestoreDb();
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      return {
        verified: data.verified || false,
        approved: data.approved || false,
      };
    }
    return { verified: false, approved: false };
  } catch (err) {
    console.error("Error checking user status:", err);
    return { verified: false, approved: false };
  }
};

export const ensureUserDoc = async (user) => {
  // Create a minimal users/{uid} document if it doesn't already exist.
  if (!user) return;
  const db = getFirestoreDb();
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || user.providerData?.[0]?.displayName || "",
        createdAt: serverTimestamp(),
        verified: false,
        approved: false,
        provider: user.providerData?.[0]?.providerId || "unknown",
      });
    }
  } catch (err) {
    console.error("ensureUserDoc error:", err);
  }
};

export const logout = async () => {
  const auth = getFirebaseAuth();
  return await signOut(auth);
};

export const getCurrentUser = () => {
  const auth = getFirebaseAuth();
  return auth.currentUser;
};

