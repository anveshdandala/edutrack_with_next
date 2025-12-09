import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_URL || "http://127.0.0.1:8000";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant = searchParams.get("tenant");
    const id = searchParams.get("id");

    if (!tenant || !id) {
      return NextResponse.json({ error: "Tenant and ID are required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cleanBase = API_BASE.replace(/\/$/, "");
    // Calls Django: /api/{tenant}/administration/student-details/{id}/
    const djangoUrl = `${cleanBase}/api/${tenant}/administration/student-details/${id}/`; 

    const res = await fetch(djangoUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
        // Log locally but don't crash client
        console.error(`[Proxy Error] Failed to fetch student details. Status: ${res.status}`);
        return NextResponse.json({ error: "Failed to fetch student details" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error(`[Proxy Error] Internal Server Error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}