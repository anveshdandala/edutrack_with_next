// D:\nah\EduTrack\et-fe\lib\server-api.js
import { cookies } from "next/headers";

const API_BASE = process.env.API_URL || "http://127.0.0.1:8000";

export async function serverFetch(
  path,
  { tenant, method = "GET", headers = {}, body, cache = "no-store" } = {},
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accesstoken")?.value;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const cleanBase = API_BASE.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  let url;

  if (tenant) {
    url = `${cleanBase}/api/${tenant}${cleanPath}`;
  } else {
    url = `${cleanBase}${cleanPath}`;
  }
  if (!url.endsWith("/") && !url.includes(".")) {
    url += "/";
  }
  console.log(`[Fetch] Requesting: ${url}`); // Watch this in your terminal!
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
