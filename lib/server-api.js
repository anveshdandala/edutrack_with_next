// D:\nah\EduTrack\et-fe\lib\server-api.js
import { cookies } from "next/headers";

const API_BASE =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

export async function serverFetch(
  path,
  { tenant, method = "GET", headers = {}, body, cache = "no-store" } = {},
) {
  // 1. Tenant Check (Crucial for Multi-tenancy)
  if (!tenant) {
    console.error("[serverFetch] Missing tenant identifier!");
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accesstoken")?.value;

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // 2. URL Construction
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Django URL normalization logic
  if (cleanPath.startsWith("/achievements")) {
    if (cleanPath.endsWith("/")) cleanPath = cleanPath.slice(0, -1);
  } else {
    if (!cleanPath.endsWith("/")) cleanPath += "/";
  }

  const cleanBase = API_BASE.replace(/\/$/, "");
  const url = `${cleanBase}/api/${tenant}${cleanPath}`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache,
    });

    // 3. Resilient Error Handling (Fixing the 401/403 crashes)
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        console.warn(`[serverFetch] Unauthorized: ${url}`);
        return null; // Return null so the UI can handle "logged out" state
      }

      const errorBody = await res.text();
      console.error(
        `[serverFetch Error] Status: ${res.status} | Body: ${errorBody}`,
      );
      return null;
    }

    // 4. Safe Parsing
    const text = await res.text();
    if (!text) return null;

    return JSON.parse(text);
  } catch (error) {
    console.error(`[serverFetch Failed] Network Error:`, error);
    return null;
  }
}
