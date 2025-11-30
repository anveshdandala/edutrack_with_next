"use client";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children, initialUser }) {
  // Initialize state with the data passed from the Server Layout
  const [user, setUser] = useState(initialUser);
  const router = useRouter();

  const login = async (username, password) => {
    // Call our Next.js API Route
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Login Failed");

    // Refresh the page so the Server Components (Layout/Page) re-run and see the new cookie
    router.refresh();
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
