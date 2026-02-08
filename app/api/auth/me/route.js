import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_URL || "http://127.0.0.1:8000";

export async function GET(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accesstoken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get tenant from query param to build the URL
  const { searchParams } = new URL(request.url);
  const tenant = searchParams.get("tenant");

  if (!tenant) {
    return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
  }

  try {
    const cleanBase = API_BASE.replace(/\/$/, "");
    const url = `${cleanBase}/api/${tenant}/auth/users/me/`;

    console.log(`[/api/auth/me] Fetching user from: ${url}`);
    console.log(`[/api/auth/me] Token found: ${token ? 'YES' : 'NO'}`);
    console.log(`[/api/auth/me] Token prefix: ${token?.substring(0, 20)}...`);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[/api/auth/me] Django returned ${res.status}:`, errorText);
      console.error(`[/api/auth/me] Response headers:`, Object.fromEntries(res.headers.entries()));

      return NextResponse.json(
        {
          error: "Failed to fetch user",
          details: errorText,
          status: res.status
        },
        { status: res.status }
      );
    }

    const user = await res.json();
    console.log(`[/api/auth/me] User fetched successfully:`, user);
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}