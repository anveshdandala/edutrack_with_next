"use client";
import React, { createContext, useEffect, useState } from "react";
import { restoreSession, logout as libLogout } from "../lib/auth";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { user: restoredUser } = await restoreSession();
        if (mounted && restoredUser) {
          setUser(restoredUser);
        }
      } catch (error) {
        console.error("Auth initialization failed", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const doLogout = async () => {
    await libLogout();
    setUser(null);
    // Optional: Redirect to login page here
    // window.location.href = '/auth/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout: doLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
