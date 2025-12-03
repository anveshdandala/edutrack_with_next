// lib/server-api.js
import { cookies } from "next/headers";

const API_BASE =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

export async function serverFetch(
  path,
  { tenant, method = "GET", ...opts } = {}
) {
  // Guard against missing tenant
  if (!tenant) {
    console.error("[serverFetch] Missing tenant!");
    throw new Error("Tenant is required for serverFetch");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accesstoken")?.value;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // Construct URL carefully
  const url = `${API_BASE}/api/${tenant}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...opts.headers,
    },
    cache: opts.cache || "no-store",
  });

  if (!res.ok) {
    // Return null or throw depending on how you want to handle it
    // Throwing ensures the Layout catches it and sets user = null
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  return res.json();
}
