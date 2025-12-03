import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Get Tenant from URL Query Params (Passed from Client)
    const { searchParams } = new URL(request.url);
    const tenant = searchParams.get("tenant"); // FIX: Actually extract the variable

    if (!tenant) {
      return NextResponse.json({ error: "Tenant is missing" }, { status: 400 });
    }

    // 2. Get Access Token from HttpOnly Cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Construct Django URL
    // Assumption: Your Django URL is mapped to /api/<tenant>/administration/create-hod/
    // Please verify this path matches your Django urls.py
    const targetUrl = `${API_BASE}/api/${tenant}/administration/create-hod/`;

    console.log(`[NextAPI] Creating HOD at: ${targetUrl}`);
    console.log(`[NextAPI] Payload:`, body);

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Manually attach token
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[NextAPI] Django Error:", data);
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[NextAPI] Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
