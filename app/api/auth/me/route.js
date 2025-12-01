import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const raw =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";
const BACKEND_URL = raw.replace(/\/$/, "");

export async function GET() {
  try {
    const cookieStore = cookies();

    // Debug: print all cookies (helpful while debugging)
    // Remove or reduce logging in production
    const all = cookieStore.getAll ? cookieStore.getAll() : [];
    console.log("👉 cookieStore contents:", all);

    // Accept several possible cookie names for compatibility
    const token =
      cookieStore.get("accesstoken")?.value ||
      cookieStore.get("accessToken")?.value ||
      cookieStore.get("token")?.value;

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
    // Try parse JSON, otherwise return raw text for debugging
    try {
      const data = JSON.parse(text);
      if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
      }
      return NextResponse.json(data, { status: 200 });
    } catch (err) {
      console.log("👉 /auth/me returned non-JSON:", text.slice(0, 1000));
      // If server returned HTML or debug page, forward it (502)
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
