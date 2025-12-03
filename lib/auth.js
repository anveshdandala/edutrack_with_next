// lib/auth.js

export async function login(username, password, tenant) {
  console.log("🔵 Client: Calling Next.js API route..."); // Look for this in BROWSER Console

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, tenant }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}
