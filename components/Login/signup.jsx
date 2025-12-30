"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signup, login, checkUserStatus, ensureUserDoc } from "@/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth, GoogleAuthProvider,sendEmailVerification,
   OAuthProvider, signInWithPopup, signInWithRedirect } from "@/lib/firebase";

function PageLogin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signup");
  const [nameInput, setNameInput] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const isSignUpValid = nameInput.trim() && emailSignUp.trim() && passwordSignUp.trim();
  const isLoginValid = emailLogin.trim() && passwordLogin.trim();

  // Listen for auth state changes to check if user verified their email
  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && awaitingVerification) {
        // Force a token refresh to get latest emailVerified status
        await user.getIdToken(true);
        await user.reload(); // Refresh user data
        
        if (user.emailVerified) {
          // User verified their email, now check status and redirect
          try {
            await ensureUserDoc(user);
            const status = await checkUserStatus(user);
            
            if (status?.verified && status?.approved) {
              router.push("/dashboard");
            } else if (status?.verified) {
              router.push("/dashboard"); // Show waiting state on dashboard
            } else {
              router.push("/verification");
            }
            setAwaitingVerification(false);
          } catch (error) {
            console.error("Error after verification:", error);
            setError("Verification complete but there was an error. Please sign in again.");
            setAwaitingVerification(false);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [awaitingVerification, router]);

  const handleSignUp = async () => {
    if (!isSignUpValid) return;

    try {
      setIsLoading(true);
      setError("");
      setVerificationEmailSent(false);
      
      // Sign up the user
      const userCredential = await signup(emailSignUp, passwordSignUp, nameInput);
      const user = userCredential.user;
      
      if (!user.emailVerified) {
        // Send verification email
        const actionCodeSettings = {
          url: `${window.location.origin}/login`,
          handleCodeInApp: true
        };
        
        await user.sendEmailVerification(actionCodeSettings);
        
        // Set awaiting verification state
        setAwaitingVerification(true);
        setCurrentUserEmail(emailSignUp);
        setVerificationEmailSent(true);
        
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        // If somehow email is already verified, proceed to check status
        try {
          await ensureUserDoc(user);
          const status = await checkUserStatus(user);
          
          if (status?.verified && status?.approved) {
            router.push("/dashboard");
          } else if (status?.verified) {
            router.push("/dashboard");
          } else {
            router.push("/verification");
          }
        } catch (err) {
          console.error("Error after signup:", err);
          setError("Account created but there was an error. Please sign in.");
        }
      }
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (type) => {
    try {
      setIsLoading(true);
      setError("");
      const auth = getFirebaseAuth();
      let provider;
      
      if (type === "google") {
        provider = new GoogleAuthProvider();
      } else if (type === "apple") {
        provider = new OAuthProvider("apple.com");
        try {
          provider.addScope('email');
          provider.addScope('name');
          provider.setCustomParameters({ locale: 'en' });
        } catch (e) {
          // provider.addScope may not be available in some envs; ignore silently
        }
      }
      
      try {
        await signInWithPopup(auth, provider);
      } catch (popupError) {
        // Fall back to redirect if popups are blocked or not supported
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/operation-not-supported-in-this-environment' || 
            popupError.code === 'auth/cancelled-popup-request') {
          await signInWithRedirect(auth, provider);
        } else {
          throw popupError;
        }
      }
      
      // Check user status to determine redirect
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Ensure a Firestore user doc exists for social sign-ins
        try {
          await ensureUserDoc(currentUser);
        } catch (err) {
          console.warn('ensureUserDoc failed:', err);
        }
        
        const status = await checkUserStatus(currentUser);
        if (status?.verified && status?.approved) {
          router.push("/dashboard");
        } else if (status?.verified) {
          router.push("/dashboard"); // Show waiting state on dashboard
        } else {
          router.push("/verification");
        }
      }
    } catch (error) {
      // Don't show error for cancelled popup
      if (error.code !== "auth/cancelled-popup-request" && 
          error.code !== "auth/popup-closed-by-user") {
        setError(error.message);
        console.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInClick = async () => {
    if (!isLoginValid) return;

    try {
      setIsLoading(true);
      setError("");
      await login(emailLogin, passwordLogin);
      
      // Check user status to determine redirect
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        // Check if email is verified
        if (!currentUser.emailVerified) {
          // Email not verified, show awaiting verification
          setAwaitingVerification(true);
          setCurrentUserEmail(emailLogin);
          setVerificationEmailSent(true);
          return;
        }
        
        // Email is verified, check user status
        try {
          await ensureUserDoc(currentUser);
        } catch (err) {
          console.warn('ensureUserDoc failed:', err);
        }
        const status = await checkUserStatus(currentUser);
        if (status?.verified && status?.approved) {
          router.push("/dashboard");
        } else if (status?.verified) {
          router.push("/dashboard"); // Show waiting state on dashboard
        } else {
          router.push("/verification");
        }
      }
    } catch (error) {
      // Only show actual errors, not cancelled requests
      if (error.code !== "auth/cancelled-popup-request" && 
          error.code !== "auth/popup-closed-by-user") {
        setError(error.message);
      }
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      setError("");
      const auth = getFirebaseAuth();
      const user = auth.currentUser;
      
      if (user) {
        const actionCodeSettings = {
          url: `${window.location.origin}/login`,
          handleCodeInApp: true
        };
        
        await user.sendEmailVerification(actionCodeSettings);
        setVerificationEmailSent(true);
        toast.success("Verification email resent!");
      }
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelVerification = () => {
    setAwaitingVerification(false);
    setVerificationEmailSent(false);
    setCurrentUserEmail("");
    
    // Sign out the user if they're still logged in
    const auth = getFirebaseAuth();
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      auth.signOut();
    }
  };

  // Show awaiting verification overlay
  if (awaitingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-black to-blue-800 p-4">
        <div className="w-full max-w-md bg-[#0f0f11]/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            
            <h2 className="text-white text-2xl font-semibold mb-3">
              Verify Your Email
            </h2>
            
            <p className="text-gray-300 mb-6">
              We've sent a verification link to:
              <br />
              <span className="font-semibold text-blue-300">{currentUserEmail}</span>
            </p>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
              <p className="text-blue-300 text-sm">
                <strong>Instructions:</strong>
                <br />
                1. Check your inbox (and spam folder) for the verification email
                <br />
                2. Click the link in the email
                <br />
                3. You'll be redirected back here automatically
                <br />
                4. Your account will be verified instantly
              </p>
            </div>
            
            {verificationEmailSent && (
              <div className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                <p className="text-green-400 text-sm">
                  ✓ Verification email sent successfully!
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3"
              >
                {isLoading ? "Sending..." : "Resend Verification Email"}
              </button>
              
              <button
                onClick={handleCancelVerification}
                disabled={isLoading}
                className="w-full bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white font-semibold rounded-xl py-3 border border-white/10"
              >
                Back to Sign In
              </button>
            </div>
            
            <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <p className="text-yellow-400 text-xs">
                <strong>Note:</strong> Make sure to click the verification link in the same browser where you signed up. The verification will happen automatically once you click the link.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-black to-blue-800 p-4">
      <div className="w-full max-w-md bg-[#0f0f11]/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
        {/* Tabs */}
        <div className="flex space-x-6 mb-6 justify-center">
          <button
            onClick={() => setActiveTab("signup")}
            className={`font-semibold border-b-2 pb-1 transition-colors ${
              activeTab === "signup"
                ? "text-white border-blue-500"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Sign up
          </button>
          <button
            onClick={() => setActiveTab("signin")}
            className={`font-semibold border-b-2 pb-1 transition-colors ${
              activeTab === "signin"
                ? "text-white border-blue-500"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Sign in
          </button>
        </div>

        <h2 className="text-white text-2xl font-semibold mb-6 text-center">
          {activeTab === "signup" ? "Create an account" : "Welcome back"}
        </h2>

        <div className="space-y-4">
          {activeTab === "signup" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <input
                type="email"
                placeholder="Enter your email"
                value={emailSignUp}
                onChange={(e) => setEmailSignUp(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
              />

              <input
                type="password"
                placeholder="Enter your password"
                value={passwordSignUp}
                onChange={(e) => setPasswordSignUp(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
              />

              <button
                onClick={handleSignUp}
                disabled={isLoading || !isSignUpValid}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3 mt-4"
              >
                {isLoading ? "Creating..." : "Create an account"}
              </button>
            </>
          )}

          {activeTab === "signin" && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
              />

              <input
                type="password"
                placeholder="Enter your password"
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
              />

              <button
                onClick={handleSignInClick}
                disabled={isLoading || !isLoginValid}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3 mt-4"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <span className="my-6 text-center text-gray-400">or {activeTab === "signup" ? "Sign Up" : "Sign In"} with</span>

        <div className="flex space-x-4">
          <button
            onClick={() => handleLogin("google")}
            disabled={isLoading}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-50"
          >
            Google
          </button>
          <button
            onClick={() => handleLogin("apple")}
            disabled={isLoading}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-50"
          >
            Apple
          </button>
        </div>

        <p className="text-gray-500 text-xs text-center mt-6">
          {activeTab === "signup"
            ? "By creating an account, you agree to our Terms & Service"
            : "Don't have an account? Create one above"}
        </p>
      </div>
    </div>
  );
}

export default PageLogin;