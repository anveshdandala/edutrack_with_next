import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const raw =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";
if (!/^https?:\/\/[^\/]+/.test(raw) && !raw.startsWith("http://127.0.0.1")) {
  console.error("Invalid BACKEND URL env var:", raw);
}
const BACKEND_URL = raw.replace(/\/$/, ""); // remove trailing slash if any

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password, tenant } = body;

    console.log("👉 Login Route: Attempting login for", username);
    console.log("👉 Using BACKEND_URL:", BACKEND_URL);
    console.log("tenant in route.js:", tenant);

    const target = `${BACKEND_URL}/api/${tenant}/auth/jwt/create/`;
    console.log("👉 Target endpoint:", target);

    const res = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    const responseText = await res.text();
    console.log(`👉 Django raw response (status ${res.status}):`, responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (err) {
      console.log("👉 Response was not JSON");
      return NextResponse.json(
        {
          error: "Upstream server returned non-JSON response",
          raw: responseText,
        },
        { status: 502 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const { access, refresh } = data;

    // Build the response and set cookies on it
    const nextRes = NextResponse.json(
      { success: true, user: data },
      { status: 200 }
    );

    const secure = process.env.NODE_ENV === "production";

    // Use nextRes.cookies.set(...) to set cookies correctly
    nextRes.cookies.set({
      name: "accesstoken",
      value: access,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure,
    });
    nextRes.cookies.set({
      name: "refreshtoken",
      value: refresh,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure,
    });

    return nextRes;
  } catch (error) {
    console.error("Login Route Critical Error:", error);
    return NextResponse.json(
      { error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
