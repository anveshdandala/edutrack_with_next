// D:\nah\EduTrack\et-fe\lib\server-api.js
import { cookies } from "next/headers";
import { buildTenantApiUrl } from "@/lib/tenant";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export async function serverFetch(
  path,
  { tenant, method = "GET", headers = {}, body, cache = "no-store" } = {},
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accesstoken")?.value;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = buildTenantApiUrl(API_BASE, tenant, cleanPath);

  console.log(`[Fetch] Requesting: ${url}`);
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

    if (!res.ok) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(`[serverFetch Error]:`, error);
    return null;
  }
}

export const fetchServer = serverFetch;
