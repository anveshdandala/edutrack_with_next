import { NextResponse } from "next/server";

// Fallback to localhost if env var is missing
const API_BASE = process.env.API_URL || "http://127.0.0.1:8000";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password, tenant } = body;

    // 1. Validate Input
    if (!username || !password || !tenant) {
      return NextResponse.json(
        { error: "Missing credentials or tenant ID" },
        { status: 400 }
      );
    }

    // 2. Prepare Django URL (Ensure strict trailing slash)
    const cleanBase = API_BASE.replace(/\/$/, "");
    const targetUrl = `${cleanBase}/api/${tenant}/auth/jwt/create/`;

    console.log(`[Proxy] Attempting login at: ${targetUrl}`);

    // 3. Call Django Backend
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Host": `${tenant}.localhost`, // Uncomment if using subdomain routing locally
      },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`[Proxy] Login Failed (${res.status}):`, data);
      // Forward the specific error from Django
      return NextResponse.json(
        { error: data.detail || "Invalid credentials" },
        { status: res.status }
      );
    }

    // 4. Set HttpOnly Cookies
    const { access, refresh } = data;
    
    const nextRes = NextResponse.json(
      { success: true, user: data.user }, // Don't send tokens in body
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === "production";
    const cookieDefaults = {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: isProduction,
    };

    // Set Access Token (e.g., 30 mins - match your Django settings)
    nextRes.cookies.set("accesstoken", access, {
      ...cookieDefaults,
      maxAge: 60 * 30, 
    });

    // Set Refresh Token (e.g., 7 days)
    nextRes.cookies.set("refreshtoken", refresh, {
      ...cookieDefaults,
      maxAge: 60 * 60 * 24 * 7,
    });

    return nextRes;

  } catch (error) {
    console.error("[Proxy] Critical Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}