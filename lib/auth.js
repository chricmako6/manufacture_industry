"use client";

import { getFirebaseAuth, getFirestoreDb } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

export const signup = async (email, password, displayName) => {
  const auth = getFirebaseAuth();
  const db = getFirestoreDb();
  
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Send verification email
  await user.sendEmailVerification({
    url: `${window.location.origin}/login`, // Redirect back to login after verification
    handleCodeInApp: true
  });

  // Create user document in Firestore only if it doesn't exist
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      // User doc doesn't exist, create it
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName || "",
        createdAt: serverTimestamp(),
        verified: false,
        approved: false,
        provider: user.providerData[0]?.providerId || "password",
      });
    }
  } catch (err) {
    console.error("Error creating user document:", err);
    // Don't block signup if Firestore write fails
  }

  return userCredential;
};

export const resendVerificationEmail = async (user) => {
  try {
    await user.sendEmailVerification({
      url: `${window.location.origin}/login`, // Redirect back to login after verification
      handleCodeInApp: true
    });
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
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