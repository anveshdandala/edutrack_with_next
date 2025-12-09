import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

    // TARGET ENDPOINT: /api/{tenant}/profiles/student-data/
    // Assuming this endpoint uses the Token to identify the student, so no ID param needed in URL
    const djangoUrl = `${API_BASE}/api/${tenant}/profiles/student-data/`;

    const res = await fetch(djangoUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[Proxy Error] Failed to fetch student-data. Status: ${res.status}`);
      return NextResponse.json({ error: "Backend fetch failed" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error(`[Proxy Error] Internal Server Error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}