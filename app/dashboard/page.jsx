'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDb } from '@/lib/firebase';
import { FiCheckCircle, FiClock, FiLogOut } from 'react-icons/fi';

export default function Dashboard() {
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/auth');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If not verified yet, redirect to verification
  if (!userData?.verified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If not approved yet, show waiting screen
  if (!approved) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          {/* Animated Loading Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 bg-yellow-400 opacity-25"></div>
              <div className="relative flex items-center justify-center h-20 w-20 bg-yellow-100 rounded-full mx-auto">
                <FiClock size={40} className="text-yellow-600 animate-bounce" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Waiting for Approval</h1>
          <p className="text-gray-600 mb-4">
            Your verification documents have been submitted successfully.
          </p>

          {/* Submitted Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-left mb-6">
            <p className="text-sm text-blue-700">
              <strong>Status:</strong> Pending Admin Review
            </p>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Email:</strong> {user?.email}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Submitted:</strong> {userData?.submittedAt ? new Date(userData.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-left mb-6">
            <p className="text-sm text-amber-800 font-medium mb-2">What happens next?</p>
            <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
              <li>Our team will review your documents</li>
              <li>We'll verify the information you provided</li>
              <li>You'll receive an update within 24-48 hours</li>
              <li>Check this page for approval status</li>
            </ul>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <FiLogOut size={20} />
            Logout
          </button>

          {/* Auto-refresh info */}
          <p className="text-xs text-gray-500 mt-4">
            This page will auto-update when your approval status changes.
          </p>
        </div>
      </div>
    );
  }

  // If approved, show success screen
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-green-100 rounded-full p-4">
            <FiCheckCircle size={48} className="text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Approval Successful!</h1>
        <p className="text-gray-600 mb-4">
          Your verification has been approved by our admin team.
        </p>

        {/* Approved Info */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded text-left mb-6">
          <p className="text-sm text-green-700">
            <strong>Status:</strong> Approved
          </p>
          <p className="text-sm text-green-700 mt-1">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="text-sm text-green-700 mt-1">
            <strong>Approved At:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-left mb-6">
          <p className="text-sm text-blue-800 font-medium mb-2">You can now:</p>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Access all features</li>
            <li>Complete your profile</li>
            <li>Start using the platform</li>
          </ul>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          <FiLogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
