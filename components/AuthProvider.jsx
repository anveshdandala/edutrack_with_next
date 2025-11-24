"use client";
import React, { createContext, useEffect, useState } from "react";
import { restoreSession, logout as libLogout } from "../lib/auth";
import { LinearProgress } from "@mui/material";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("[AuthProvider] start");

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      console.log("[AuthProvider] initAuth start");
      try {
        const { user: restoredUser } = await restoreSession();
        console.log("[AuthProvider] restoreSession returned:", restoredUser);
        if (mounted && restoredUser) {
          console.log(
            "[AuthProvider] setting user from restoreSession:",
            restoredUser
          );
          setUser(restoredUser);
        }
      } catch (error) {
        console.error("[AuthProvider] Auth initialization failed", error);
      } finally {
        if (mounted) setLoading(false);
        console.log(
          "[AuthProvider] initAuth done, loading:",
          mounted ? false : "unmounted"
        );
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const doLogout = async () => {
    await libLogout();
  };

  return (
    <>
      {loading && <LinearProgress />}
      <AuthContext.Provider
        value={{ user, setUser, loading, logout: doLogout }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
