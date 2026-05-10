"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, logoutUser } from "@/actions/auth";

export function useAuth(requireAuth = false) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState("Traveler");
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const user = await getSession();
      if (user) {
        setIsAuthenticated(true);
        setDisplayName(user.fullName || user.email.split("@")[0]);
      } else {
        setIsAuthenticated(false);
        if (requireAuth) {
          router.push("/login");
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [requireAuth, router]);

  const logout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    router.push("/login");
    router.refresh();
  };

  return { loading, isAuthenticated, displayName, logout };
}
