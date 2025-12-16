'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDb } from '@/lib/firebase';

function approvalwait() {
   const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approved, setApproved] = useState(false);
    const router = useRouter();
    const auth = getFirebaseAuth();
    const db = getFirestoreDb();
   // Check authentication and listen to user data changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Not logged in, redirect to auth
        router.replace('/auth');
        return;
      }

      setUser(currentUser);

      // Listen to real-time updates on user document
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setApproved(data.approved || false);
            setLoading(false);
          } else {
            // User doc doesn't exist, redirect to verification
            router.replace('/verification');
          }
        });

        return () => unsubDoc();
      } catch (err) {
        console.error('Error listening to user data:', err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db, router]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-3xl bg-white rounded-lg p-6 text-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData?.verified) {
    return (
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="w-full max-w-3xl h-[280px] bg-white rounded-lg p-6 text-center">
          <div className="text-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Please verify your email. Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  // Default waiting UI when userData.verified is true but approved is false
  // Default waiting UI when userData.verified is true but approved is false
  return (
    <div className=" absolute top-0 left-0 w-full h-full ">
      <div className="relative max-w-3xl h-[280px] bg-white rounded-lg p-6 text-center">
        <div className="mb-4 flex items-center justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        </div>
        <h3 className="relative text-2xl font-bold mb-2">Waiting for Admin Approval</h3>
        <p className="text-sm text-gray-700 mb-2">Your documents have been submitted. An administrator will review and approve your account shortly.</p>
        <p className="text-sm text-gray-500">Email: <strong>{user?.email}</strong></p>
      </div>
    </div>
  );
}

export default approvalwait;