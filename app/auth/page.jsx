"use client";
import React from 'react'
import Login from '../../components/Login/signup'
import { useEffect, useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

function pageAuth() {
  const router = useRouter();
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, prevent access
        router.replace("/verification");
      } else {
        // User is not logged in, allow access
        setCanAccess(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading || !canAccess) {
    return null; // Show nothing, preventing access
  }
  return (
    <div>
      <Login />
    </div>
  )
}

export default pageAuth