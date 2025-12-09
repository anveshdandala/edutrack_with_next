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
  
  // Debug: Check if we actually found a token
  if (!token) console.warn("[serverFetch] No access token found in cookies");

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // URL Construction Logic
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  // FIX: Achievements endpoints fail with a trailing slash
  if (cleanPath.startsWith("/achievements")) {
      if (cleanPath.endsWith("/")) cleanPath = cleanPath.slice(0, -1);
  } else {
      if (!cleanPath.endsWith("/")) cleanPath += "/"; // Force Django trailing slash for others
  }
  const cleanBase = API_BASE.replace(/\/$/, "");
  const url = `${cleanBase}/api/${tenant}${cleanPath}`;

  const start = Date.now();
  console.log(`[Fetch Start] ${method} ${url}`);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        // Connection: "close", 

        ...authHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache,
    });

    const ms = Date.now() - start;

    // --- CRITICAL FIX START ---
    if (!res.ok) {
      // Read the error message from Django (e.g., "Authentication credentials were not provided")
      const errorText = await res.text(); 
      console.error(`[Fetch Error] Status: ${res.status} | URL: ${url}`);
      console.error(`[Fetch Error] Body:`, errorText); // <--- THIS WILL REVEAL THE BUG
      return null;
    }
    // --- CRITICAL FIX END ---

    const text = await res.text();
    console.log(`[Fetch Success] ${res.status} in ${ms}ms`);
    
    if (!text) return null;
    return JSON.parse(text);

  } catch (error) {
    console.error(`[Fetch Failed] Network/Server Error in ${Date.now() - start}ms:`, error);
    return null;
  }
}