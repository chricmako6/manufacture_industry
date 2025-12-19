'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc, onSnapshot } from "firebase/firestore";
import { getFirebaseAuth, getFirestoreDb } from "@/lib/firebase";
import { FiEdit2, FiCheckCircle } from 'react-icons/fi';
import Approvalwait from './approvalwait';
import UserDetail from './userdetail';
import Document from './document';
import PaymentInfo from './paymentinfo';

function Preview() {
  const [isApproved, setIsApproved] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const router = useRouter();
  const auth = getFirebaseAuth();
  const db = getFirestoreDb();

// 🔐 Ensure user is authenticated and not already verified
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/auth"); // not logged in
        setLoading(false);
      } else {
        try {
          // Check if user already submitted verification
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists() && userDocSnap.data()?.approved) {
            // User already approved, redirect to dashboard
            router.replace("/dashboard");
            return;
          }
          setUser(currentUser);
          setLoading(false);
        } catch (err) {
          console.log("Error checking verification:", err);
          setUser(currentUser);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [auth, router, db]);

  // Prevent background scrolling when modals/overlays are shown
  useEffect(() => {
    const locked = showEmailPrompt || waitingForApproval;
    if (typeof window !== 'undefined') {
      document.body.style.overflow = locked ? 'hidden' : '';
    }
    return () => {
      if (typeof window !== 'undefined') document.body.style.overflow = '';
    };
  }, [showEmailPrompt, waitingForApproval]);

  // While user is shown the "check your email" prompt, poll the auth user
  // to detect when they've clicked the verification link. When verified,
  // switch to waiting-for-approval and start listening for admin approval.
  useEffect(() => {
    let interval = null;
    let unsub = null;

    if (showEmailPrompt && user) {
      interval = setInterval(async () => {
        try {
          if (auth?.currentUser?.reload) await auth.currentUser.reload();
          const nowVerified = !!auth?.currentUser?.emailVerified;
          if (nowVerified) {
            setEmailVerified(true);
            setShowEmailPrompt(false);
            setWaitingForApproval(true);

            const userDocRef = doc(db, 'users', user.uid);
            unsub = onSnapshot(userDocRef, (snap) => {
              if (!snap.exists()) return;
              const data = snap.data();
              if (data && data.approved) {
                if (unsub) unsub();
                router.push('/dashboard');
              }
            });
          }
        } catch (err) {
          console.warn('Email verification poll failed', err);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (unsub) unsub();
    };
  }, [showEmailPrompt, user, auth, db, router]);

  // Submit verification data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    try {
      setSubmitting(true);
      setIsApproved(true); // Show waiting state

      // VERY IMPORTANT PART
      // We use the AUTHENTICATED USER UID and extract data from previewData
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          verified: false, // marks that user submitted verification
          approved: false, // Initially not approved by admin
          provider: user.providerData[0]?.providerId,
          createdAt: serverTimestamp(),
          submittedAt: serverTimestamp(),
          personal: previewData.personal,
          document: previewData.document,
          payment: previewData.payment,
        },
        { merge: true }
      );

      // Refresh auth user to get latest emailVerified state
      try {
        if (auth?.currentUser?.reload) await auth.currentUser.reload();
      } catch (reloadErr) {
        console.warn('Could not reload user:', reloadErr);
      }

      const isEmailVerified = !!auth?.currentUser?.emailVerified;
      setEmailVerified(isEmailVerified);

      // Hide form after successful submission
      setShowForm(false);

      if (!isEmailVerified) {
        // Send verification email and prompt user to check their inbox
        try {
          await sendEmailVerification(auth.currentUser);
        } catch (sendErr) {
          console.warn('sendEmailVerification failed', sendErr);
        }
        setShowEmailPrompt(true);
        setWaitingForApproval(false);
      } else {
        // Email already verified: stay on verification page and wait for admin approval
        setWaitingForApproval(true);

        // Listen for approved flag on the user document
        const userDocRef = doc(db, 'users', user.uid);
        const unsub = onSnapshot(userDocRef, (snap) => {
          if (!snap.exists()) return;
          const data = snap.data();
          if (data.approved) {
            // approved by admin -> navigate to dashboard
            unsub();
            router.push('/dashboard');
          }
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setIsApproved(false); // Reset on error
      alert("Verification failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  const handleApprove = () => {
    setIsApproved(true);
    alert('All information has been verified and waiting for approval!');
  };

  const handleEdit = (section) => {
    alert(`Edit ${section} information`);
    // You can navigate to the respective edit page here
  };

  return (
    <>
      {showForm && (
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Verification Preview</h1>
          <p className="text-gray-600">Review all information before final submission</p>
        </div>

        {/* Approval Status */}
        {isApproved && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6 flex items-center gap-3">
            <FiCheckCircle size={24} className="text-green-600" />
            <div>
              <p className="font-bold text-green-800">Verification Complete</p>
              <p className="text-green-700 text-sm">All information has been verified and approved successfully!</p>
            </div>
          </div>
        )}

        {/* Personal Information Section */}
        <div className="mb-6">
          <UserDetail />
        </div>

        {/* Document Information Section */}
        <div className="mb-6">
          <Document />
        </div>

        {/* Payment Information Section */}
        <div className="mb-6">
          <PaymentInfo />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            type="submit"
            disabled={submitting || waitingForApproval}
            onClick={() => {
                    // allow user to logout and come back later
                    router.push('/verification');
                  }}
            className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FiCheckCircle size={20} />
            {waitingForApproval ? 'Waiting for Approval' : isApproved ? 'Verified & Wait for Approval' : 'Verify & Approve All'}
          </button>
          <button
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
          >
            Go Back
          </button>
        </div>

        {/* Footer Note */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-700">
            📋 Please review all information carefully. Click on the edit icon next to each section to make corrections.
          </p>
        </div>
      </form>
      )}
        
        {(waitingForApproval || showEmailPrompt) && (
          <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center overflow-hidden">
            <Approvalwait />
          </div>
        )}
    
    </>
  );
}

export default Preview;