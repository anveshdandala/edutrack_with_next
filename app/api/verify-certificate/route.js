import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_URL || "http://127.0.0.1:8000";

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, tenant } = body;

    if (!id || !status || !tenant) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Django Endpoint: PATCH /api/{tenant}/achievements/verify-certificate/{id}/
    const cleanBase = API_BASE.replace(/\/$/, "");
    const djangoUrl = `${cleanBase}/api/${tenant}/achievements/verify-certificate/${id}/`;

    console.log(`[Proxy] Verifying certificate ${id} to ${status}`);

    const res = await fetch(djangoUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }), // Sending the new status
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Proxy Error]:", errorText);
      return NextResponse.json({ error: "Failed to update status" }, { status: res.status });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("[Proxy] Internal Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}