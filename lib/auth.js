// This file runs in the browser ("use client" context)

// 1. Call your Next.js API Route (which sets the cookie)
export async function login(username, password) {
  console.log("[auth.js] credentials : ", username, password);
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  console.log("[auth.js] login res ", res);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Login failed");
  }

  return true; // Success
}

// 2. Logout via Next.js API (clears cookie)
export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// 3. Get User via Proxy (because Client can't read the HttpOnly cookie)
export async function fetchUserMe() {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return null;
  return res.json();
}
