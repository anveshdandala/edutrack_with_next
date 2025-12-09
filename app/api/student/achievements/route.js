import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = (process.env.API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant = searchParams.get("tenant");

    if (!tenant) return NextResponse.json({ error: "Tenant is required" }, { status: 400 });

    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Endpoint: /api/{tenant}/administration/student-achievements/
    const url = `${API_BASE}/api/${tenant}/administration/student-achievements/`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}