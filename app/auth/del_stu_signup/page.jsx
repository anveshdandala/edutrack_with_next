"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export default function TestUserSignup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const formatErrors = (errObj) => {
    if (!errObj) return "";
    if (typeof errObj === "string") return errObj;
    try {
      return JSON.stringify(errObj);
    } catch {
      return String(errObj);
    }
  };

  // call your JWT create endpoint
  const jwtCreate = async (uname, pass) => {
    try {
      const res = await fetch(`${API}/auth/jwt/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: uname,
          password: pass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(formatErrors(data) || "JWT create failed");
      }

      // backend should return { access, refresh } or at least { access }
      const { access, refresh } = data;

      if (!access) {
        throw new Error("No access token returned from server.");
      }

      // set in state
      setAccessToken(access);

      // optional: persist access token to localStorage (not recommended for long-lived tokens)
      // if you're using refresh cookies (HttpOnly), do NOT store refresh in localStorage.
      try {
        localStorage.setItem("access_token", access);
      } catch (e) {}

      return { access, refresh };
    } catch (err) {
      throw err;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (password !== rePassword) {
      setMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 1) create user
      const res = await fetch(`${API}/auth/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          password,
          re_password: rePassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(`Signup failed: ${formatErrors(data)}`);
        setLoading(false);
        return;
      }

      // 2) immediately request JWT tokens using the credentials
      try {
        const { access } = await jwtCreate(username, password);
        setMsg("Account created and logged in.");
        // redirect to dashboard or wherever
        // router.push("/dashboard"); // enable if you want redirect
      } catch (jwtErr) {
        // If jwt creation fails: the account was created but you couldn't login automatically
        setMsg(
          `Account created but login failed: ${
            jwtErr?.message ?? String(jwtErr)
          }`
        );
      }
    } catch (err) {
      setMsg(`Network error: ${err?.message ?? String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>

      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        <label className="text-sm">Email</label>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />

        <label className="text-sm">Username</label>
        <input
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />

        <label className="text-sm">Password</label>
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />

        <label className="text-sm">Confirm Password</label>
        <input
          name="re_password"
          type="password"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>

      <div className="mt-4 text-sm">
        {msg && <div className="mb-2">{msg}</div>}
        <div>
          Token:{" "}
          {accessToken ? (
            <span className="break-all bg-gray-900 text-white px-2 py-1 rounded text-xs">
              {accessToken}
            </span>
          ) : (
            <span className="text-gray-500">No token</span>
          )}
        </div>
      </div>
    </div>
  );
}
