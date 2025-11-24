"use client";
import { useState, useEffect } from "react";
import useAuth from "@/components/useAuth";
import { useRouter } from "next/navigation";
import { login as apiLogin } from "@/lib/auth.js";
export default function InstitutionLogin() {
  const { user, loading, setUser } = useAuth();

  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    console.log("user, loading:", user, loading);
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userRes = await apiLogin(username, password);
      setUser(userRes);
      console.log("[institutionLogin] user details", userRes);
      if (userRes) {
        router.push("/institution");
      }
    } catch (err) {
      setError(err.message);
      console.log("error submitting", err.message);
    }
  };

  return (
    <>
      <div className="institution-login">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username">username:</label>
            <input
              type="username"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}{" "}
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
