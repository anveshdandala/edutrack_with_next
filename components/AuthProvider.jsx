"use client";
import React, { createContext, useEffect, useState } from "react";
import {
  restoreSession,
  getStoredUser,
  logout as libLogout,
} from "../lib/auth";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // attempt to restore session (refresh access, fetch profile)
    restoreSession()
      .then((result) => {
        if (!mounted) return;
        if (result?.user) setUser(result.user);
      })
      .catch(() => {
        // ignore errors, user stays null
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const doLogout = async () => {
    await libLogout({ callServer: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout: doLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
