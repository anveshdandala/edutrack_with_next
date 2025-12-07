import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_URL || "http://127.0.0.1:8000";

export async function GET(request, { params }) {
  try {
    // 1. Get the Resume ID from the URL path (e.g., /api/resume/resume/123)
    const { id } = await params; 
    
    // 2. Get Tenant and Token
    const { searchParams } = new URL(request.url);
    const tenant = searchParams.get("tenant");
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value;

    if (!tenant || !token) {
      return NextResponse.json(
        { error: "Unauthorized or missing tenant" },
        { status: 401 }
      );
    }

    // 3. Construct Django Backend URL
    const backendUrl = `${API_BASE}/api/${tenant}/resume/resume/${id}/`;
    console.log(`[Proxy GET] Fetching resume ${id} from:`, backendUrl);

    // 4. Forward Request
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Resume GET Proxy Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}