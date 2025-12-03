// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

export async function GET(request) {
  // 1. Get the tenant from query params (e.g. ?tenant=vmeg)
  const { searchParams } = new URL(request.url);
  const tenant = searchParams.get("tenant");

  if (!tenant) {
    return NextResponse.json({ error: "Tenant required" }, { status: 400 });
  }

  // 2. Access the HttpOnly cookie (Allowed here on Server)
  const cookieStore = await cookies();
  const token = cookieStore.get("accesstoken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 3. Call Django on behalf of the user
  const target = `${API_BASE}/api/${tenant}/auth/users/me/`;

  try {
    const res = await fetch(target, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    console.log("[auth me healper] res", data);

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // 4. Return the user data to the client
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
