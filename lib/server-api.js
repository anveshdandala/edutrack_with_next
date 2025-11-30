import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function fetchServer(endpoint, options = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    // If 401, Middleware should have caught it, but just in case
    console.error(`[Server API Error] Status: ${res.status}`);
    if (res.status === 401) return null;
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}
