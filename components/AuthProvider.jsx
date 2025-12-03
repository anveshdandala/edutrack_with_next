"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  user: null,
  setUser: () => {}, // <--- Key addition: allows LoginPage to update state
  logout: async () => {},
});

export function AuthProvider({ children, initialUser }) {
  // 1. Initialize state with data fetched from Server Layout (performance boost)
  const [user, setUser] = useState(initialUser);
  const router = useRouter();

  // Sync state if the server passes new data (e.g. after a refresh)
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  const logout = async () => {
    try {
      // Call Next.js API route to delete HttpOnly cookies
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed", err);
    }

    // Clear client state
    setUser(null);

    // Refresh server components to ensure cookies are gone on server too
    router.refresh();

    // Redirect to a safe public page (e.g., global login)
    router.push("/globalLogin");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
