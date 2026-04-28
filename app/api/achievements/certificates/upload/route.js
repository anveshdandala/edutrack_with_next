import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { buildTenantApiUrl } from "@/lib/tenant";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function POST(request) {
  try {
    const headersList = await headers();
    const tenant = headersList.get("x-tenant");
    
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value;

    if (!tenant || !token) {
      return NextResponse.json({ error: "Unauthorized or missing tenant" }, { status: 401 });
    }

    // 1. Grab the raw FormData from the incoming frontend request
    const incomingFormData = await request.formData();

    // 2. Build the Django URL
    const targetUrl = buildTenantApiUrl(API_BASE, tenant, "/achievements/certificates/upload/");

    // 3. Forward to Django
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "x-tenant": tenant,
        // CRITICAL: Do NOT set "Content-Type" here. fetch() will do it automatically for FormData.
      },
      body: incomingFormData,
      duplex: "half", // Required by Next.js 18+ for streaming requests
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("[Upload Proxy] Error:", error);
    return NextResponse.json({ error: "Internal proxy error" }, { status: 500 });
  }
}