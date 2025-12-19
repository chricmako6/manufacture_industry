"use client";
import React, { useState, useEffect } from "react";
import Approvalwait from "./../../components/verifyComp/approvalwait";

import { useRouter } from "next/navigation";
import { TiTick } from "react-icons/ti";
import { FiLogOut, FiCheckCircle } from "react-icons/fi";
import { FaUser, FaCreditCard, FaFileAlt, FaEye } from "react-icons/fa";

import { auth, getFirestoreDb } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logout, checkUserStatus } from "@/lib/auth";

function PageVerify() {
  const [step, setStep] = useState(1);
  const [isApproved, setIsApproved] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const db = getFirestoreDb();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  };

  const steps = [
    { id: 1, title: "User Details", icon: FaUser },
    { id: 2, title: "Payment Info", icon: FaCreditCard },
    { id: 3, title: "Documents", icon: FaFileAlt },
    { id: 4, title: "Preview", icon: FaEye },
  ];

  const nextStep = () => step < 4 && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  // 🔐 AUTH GUARD — KEEP THIS ONE (CORRECT)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/auth");
        return;
      }

      try {
        const status = await checkUserStatus(currentUser);

        if (status?.verified && status?.approved) {
          router.replace("/dashboard");
          return;
        }

        setUser(currentUser);
        setCanAccess(true);
      } catch (err) {
        console.warn("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  // Prevent background scrolling when overlays are shown
  useEffect(() => {
    const locked = showEmailPrompt || waitingForApproval;
    if (typeof window !== "undefined") {
      document.body.style.overflow = locked ? "hidden" : "";
    }
    return () => {
      if (typeof window !== "undefined") document.body.style.overflow = "";
    };
  }, [showEmailPrompt, waitingForApproval]);

  // Email verification polling
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
          }
        } catch (err) {
          console.warn("Email verification poll failed", err);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (unsub) unsub();
    };
  }, [showEmailPrompt, user, auth]);


  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) return null;
  if (!canAccess || !user) return null;

  const handleSubmit = async (e) => {
  e.preventDefault(); // ⛔ stop page reload

  try {
    setSubmitting(true);

    // 👉 this is where you will later:
    // - save data to Firestore
    // - trigger verification
    // - send admin approval request

    console.log("Verification submitted");

    // example state changes
    setShowForm(false);
    setWaitingForApproval(true);

  } catch (error) {
    console.error("Submission error:", error);
  } finally {
    setSubmitting(false);
  }
};

  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
    : user.email.charAt(0).toUpperCase();


  return (
    <div className="min-h-screen bg-linear-to-b from-black via-[#050510] to-[#020214] text-white p-6 flex flex-col items-center">

      {/* Top Profile Card */}
      <div className="w-full max-w-3xl bg-[#111118]/70 backdrop-blur-xl p-5 rounded-xl shadow-2xl border border-white/10 mb-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-yellow-900 flex items-center justify-center text-xl font-bold">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user.displayName || "User"}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
            <div className="grow flex justify-end">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-2 rounded-full text-white/90 hover:bg-white/6"
              >
                <FiLogOut className="size-5"/>
              </button>
            </div>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-2">Complete Your Profile</h1>
      <p className="text-gray-400 text-sm mb-10">Fill in your information to get started</p>

      {/* Steps Card */}
      <div className="w-full max-w-3xl bg-[#111118]/60 backdrop-blur-xl p-10 rounded-2xl shadow-xl border border-white/10">

        {/* Step Navigation With Progress Lines */}
        <div className="flex items-center justify-between mb-10 relative w-full">
          {steps.map((s, index) => {
            const isCompleted = step > s.id;
            const isActive = step === s.id;
            const isPending = step < s.id;

            return (
              <div key={s.id} className="flex items-center relative">

                {/* Line Before This Step (except step 1) */}
                {index !== 0 && (
                  <div
                    className={`
                      h-1 w-24 mx-4 rounded-full transition-all duration-300
                      ${isCompleted ? "bg-green-400" : ""}
                      ${isActive ? "bg-green-400" : ""}
                      ${isPending && step < s.id ? "bg-gray-700" : ""}
                    `}
                  ></div>
                )}

                {/* Step Circle */}
                <div className="text-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full border flex items-center justify-center mx-auto
                      transition-all duration-300
                      ${isCompleted ? "bg-green-500 border-green-400" : ""}
                      ${isActive ? "border-white bg-white/10" : ""}
                      ${isPending ? "border-white/10 bg-white/5" : ""}
                    `}
                  >
                    {isCompleted ? (
                      <span className="text-white text-xl w-5 h-5">
                        <TiTick />
                      </span>
                    ) : (
                      <s.icon className="text-sm text-gray-300 w-5 h-5" />
                    )}
                  </div>

                  <p className="mt-2 text-sm">step {s.id}</p>
                  <p className="text-sm">{s.title}</p>

                  {isActive && <span className="text-blue-400 text-xs">In Progress</span>}
                  {isPending && <span className="text-gray-500 text-xs">Pending</span>}
                  {isCompleted && <span className="text-green-400 text-xs">Completed</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="text-center text-gray-300 mb-10">
          {/* USERDETAILS */}
          {step === 1 && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800">Edit Personal Information</h1>
                </div>

                <form className="space-y-6">
                  {/* Row 1: Gender and Date of Birth */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                      <input
                        type="text"
                        name="gender"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date of birth</label>
                      <input
                        type="text"
                        name="dateOfBirth"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Row 2: Identify Code and Hometown */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Identify code</label>
                      <input
                        type="text"
                        name="identifyCode"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hometown</label>
                      <input
                        type="text"
                        name="hometown"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Row 3: Nationality and Religion */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality</label>
                      <input
                        type="text"
                        name="nationality"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Religion</label>
                      <input
                        type="text"
                        name="religion"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Row 4: Language and Marital Status */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                      <input
                        type="text"
                        name="language"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Marital status</label>
                      <input
                        type="text"
                        name="maritalStatus"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                </form>
              </div>
            </div>
          )}
          {step === 2 && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Edit Payment Information</h1>
                  </div>

                  <form className="space-y-6">
                    {/* Row 1: Cardholder Name and Card Type */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardholderName"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Card Type</label>
                        <input
                          type="text"
                          name="cardType"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Row 2: Card Number and Expiry Date */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Row 3: Bank Name and Account Type */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                        <input
                          type="text"
                          name="bankName"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
                        <input
                          type="text"
                          name="accountType"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Row 4: Payment Method and Currency */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                        <input
                          type="text"
                          name="paymentMethod"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                        <input
                          type="text"
                          name="currency"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Billing Address</label>
                      <textarea
                        name="billingAddress"
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Row 5: City, State, Zip Code */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="billingCity"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          name="billingState"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code</label>
                        <input
                          type="text"
                          name="billingZipCode"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
          )}
          {step === 3 && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Edit Document Information</h1>
                  </div>

                  <form className="space-y-6">
                    {/* Row 1: Document Type and Document Number */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label>
                        <input
                          type="text"
                          name="documentType"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Document Number</label>
                        <input
                          type="text"
                          name="documentNumber"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Row 2: Issue Date and Expiry Date */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Date</label>
                        <input
                          type="text"
                          name="issueDate"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Row 3: Issuing Authority and Country */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Issuing Authority</label>
                        <input
                          type="text"
                          name="issuingAuthority"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Issuing Country</label>
                        <input
                          type="text"
                          name="issuingCountry"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Row 4: Place of Issue and Document Status */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Place of Issue</label>
                        <input
                          type="text"
                          name="placeOfIssue"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Document Status</label>
                        <input
                          type="text"
                          name="documentStatus"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Row 5: Full Name and Date of Birth */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="text"
                          name="dateOfBirth"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Document Notes */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Document Notes</label>
                      <textarea
                        name="documentNotes"
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </form>
                </div>
              </div>
          )}
          {step === 4 && (
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
                        Please review all information carefully. Click on the edit icon next to each section to make corrections.
                      </p>
                    </div>
                  </form>
                  )}
                    
                  {/* THIS IS THE WAITING FOR APPROVAL OVERLAY */}
                  {(waitingForApproval || showEmailPrompt) && (
                    <div className="fixed inset-0 z-9999 backdrop-blur-sm flex items-center justify-center">
                      <Approvalwait />
                    </div>
                  )}
            </>
          )},
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`px-6 py-2 rounded-xl border border-white/20 ${
              step === 1
                ? "text-gray-600 border-gray-800"
                : "hover:bg-white/10"
            }`}
          >
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={step === 4}
            className={`px-6 py-2 rounded-xl bg-white/10 border border-white/20 ${
              step === 4 ? "opacity-30" : "hover:bg-white/20"
            }`}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default PageVerify;
