import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Ensure no trailing slash in base
const API_BASE = (process.env.API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant = searchParams.get("tenant");

    if (!tenant) {
      return NextResponse.json({ error: "Tenant is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Backend Endpoint: /api/{tenant}/administration/departments/
    // Ensure trailing slash for Django
    const url = `${API_BASE}/api/${tenant}/administration/departments/`;

    console.log(`[Proxy] Fetching Departments: ${url}`);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error(`[Fetch Error] Status: ${res.status} | Body: ${errorText}`);
        return NextResponse.json({ error: "Backend error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}