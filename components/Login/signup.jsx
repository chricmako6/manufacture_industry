"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, login, checkUserStatus, ensureUserDoc } from "@/lib/auth";
import { getFirebaseAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithRedirect } from "@/lib/firebase";

function PageLogin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signup");
  const [isSignUp, setIsSignUp] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignUpValid = nameInput.trim() && emailSignUp.trim() && passwordSignUp.trim();
  const isLoginValid = emailLogin.trim() && passwordLogin.trim();

  const handleSignUp = async () => {
    if (!isSignUpValid) return;

    try {
      setIsLoading(true);
      setError("");
      await signup(emailSignUp, passwordSignUp, nameInput);
      // After signup, user needs to go to verification
      router.push("/verification");
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
        // Request common scopes for Apple (email, name)
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
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/operation-not-supported-in-this-environment' || popupError.code === 'auth/cancelled-popup-request') {
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
      if (error.code !== "auth/cancelled-popup-request" && error.code !== "auth/popup-closed-by-user") {
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
        // Ensure Firestore doc exists (for completeness)
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
      if (error.code !== "auth/cancelled-popup-request" && error.code !== "auth/popup-closed-by-user") {
        setError(error.message);
      }
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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