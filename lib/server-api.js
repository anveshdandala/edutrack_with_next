import { cookies } from "next/headers";

const API_BASE =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

export async function serverFetch(
  path,
  { tenant, method = "GET", headers = {}, body, cache = "no-store" } = {}
) {
  if (!tenant) {
    console.error("[serverFetch] Missing tenant!");
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accesstoken")?.value;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // 1. Ensure path starts with /
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  // 2. FORCE TRAILING SLASH (Critical for Django)
  if (!cleanPath.endsWith("/")) {
    cleanPath += "/";
  }

  // Remove trailing slash from base to avoid double slash
  const cleanBase = API_BASE.replace(/\/$/, "");
  const url = `${cleanBase}/api/${tenant}${cleanPath}`;

  const start = Date.now();
  console.log(`[Fetch Start] ${method} ${url}`);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        // 3. CRITICAL FIX: Close connection to prevent single-thread blocking
        Connection: "close",
        ...authHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache,
    });

    const ms = Date.now() - start;
    console.log(`[Fetch End] ${res.status} in ${ms}ms`);

    if (!res.ok) {
      return null;
    }

    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error(`[Fetch Failed] ${Date.now() - start}ms:`, error);
    return null;
  }
}
