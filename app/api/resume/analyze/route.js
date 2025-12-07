import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_URL || "http://127.0.0.1:8000";

export async function POST(request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();

    const { searchParams } = new URL(request.url);
    const tenant = searchParams.get("tenant");
    const token = cookieStore.get("accesstoken")?.value;

    if (!tenant || !token) {
      return NextResponse.json(
        { error: "Unauthorized or missing tenant" },
        { status: 401 }
      );
    }

    const backendUrl = `${API_BASE}/api/${tenant}/resume/analyze/`;
    console.log(`[Proxy POST] Analyzing resume at:`, backendUrl);

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Resume Analysis Proxy Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
