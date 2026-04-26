import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { buildTenantApiUrl } from "@/lib/tenant";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function POST(request) {
  try {
    // 2. Parse Body safely
    const body = await request.json();
    const { username, password, tenant } = body;

    if (!username || !password || !tenant) {
      return NextResponse.json(
        { error: "Missing credentials or tenant ID" },
        { status: 400 },
      );
    }

    // 3. Call Django Backend
    const targetUrl = buildTenantApiUrl(API_BASE, tenant, "/auth/jwt/create/");

    const djangoRes = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant": tenant,
      },
      body: JSON.stringify({ username, password }),
    });

    if (!djangoRes.ok) {
      // Forward the exact error from Django (e.g., "No active account found")
      const errorData = await djangoRes.json();
      return NextResponse.json(errorData, { status: djangoRes.status });
    }

    const { access, refresh } = await djangoRes.json();
    const cookieStore = await cookies();

    // 4. Set Cookies
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    };

    cookieStore.set("tenant", tenant, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set("accesstoken", access, {
      ...cookieOptions,
      maxAge: 60 * 60,
    });
    cookieStore.set("refreshtoken", refresh, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    // This catches JSON parsing errors or fetch failures
    console.error("[Login Proxy Error]:", err.message);
    return NextResponse.json(
      { error: "Authentication service unavailable" },
      { status: 500 },
    );
  }
}
