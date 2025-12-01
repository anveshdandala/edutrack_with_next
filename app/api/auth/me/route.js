// app/api/auth/me/route.js  (or wherever your route is)
import { NextResponse } from "next/server";

const raw =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";
const BACKEND_URL = raw.replace(/\/$/, "");

// lightweight cookie parser
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((c) => {
    const [k, ...v] = c.split("=");
    if (!k) return;
    cookies[k.trim()] = decodeURIComponent((v || []).join("=").trim());
  });
  return cookies;
}

export async function GET(request) {
  try {
    // Read raw Cookie header (works consistently in route handlers)
    const cookieHeader = request.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    console.log("👉 parsed cookies:", cookies);

    // Try multiple token names for compatibility
    const token =
      cookies["accesstoken"] ||
      cookies["accesstoken"] ||
      cookies["token"] ||
      cookies["access_token"];

    if (!token) {
      console.log("👉 No access token found in cookies");
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const target = `${BACKEND_URL}/auth/users/me/`;
    console.log("👉 Fetching user from:", target);

    const res = await fetch(target, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      if (!res.ok) {
        console.log("👉 Upstream returned non-OK status:", res.status, data);
        return NextResponse.json(data, { status: res.status });
      }
      return NextResponse.json(data, { status: 200 });
    } catch (err) {
      console.log("👉 /auth/users/me returned non-JSON:", text.slice(0, 1000));
      return NextResponse.json(
        { error: "Upstream returned non-JSON", raw: text },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("👉 /api/auth/me critical error:", error);
    return NextResponse.json(
      { error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
