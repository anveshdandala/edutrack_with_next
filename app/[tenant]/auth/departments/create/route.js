import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_URL || "http://127.0.0.1:8000";

export async function POST(request) {
  try {
    // 1. Get Tenant from URL
    const { searchParams } = new URL(request.url);
    const tenant = searchParams.get("tenant");

    if (!tenant)
      return NextResponse.json({ error: "Tenant missing" }, { status: 400 });

    // 2. Get HttpOnly Cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 3. Get Body from Request
    const body = await request.json();

    // 4. Call Django
    // URL pattern: /api/<tenant>/administration/departments/create/
    // (Adjust path to match your Django URL conf)
    const djangoUrl = `${API_BASE}/api/${tenant}/administration/departments/`;

    const res = await fetch(djangoUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // <--- Attach Token
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
