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

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: res.status }
      );
    }

    const user = await res.json();
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}