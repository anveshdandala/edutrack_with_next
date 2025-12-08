// D:\nah\SIH\newshi\app\api\admin\hod\create\route.js

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("👉 Proxy: Starting Create HOD request...");

  try {
    // FIX 1: Extract Tenant from Query Params
    const { searchParams } = new URL(request.url);
    const tenant = searchParams.get("tenant");

    if (!tenant) {
      return NextResponse.json(
        { detail: "Missing tenant parameter" },
        { status: 400 }
      );
    }

    // FIX 2: Await cookies (Required for Next.js 15+)
    const cookieStore = await cookies();
    const accesstoken = cookieStore.get("accesstoken")?.value;

    if (!accesstoken) {
      console.error("❌ Proxy: No access token found.");
      return NextResponse.json(
        { detail: "Unauthorized: No session token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Clean up API Base (remove trailing slash if exists)
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000").replace(/\/$/, "");

    const djangoUrl = `${apiBase}/api/${tenant}/administration/create-hod/`; 

    console.log(`👉 Proxy: Forwarding to Django: ${djangoUrl}`);

    const djangoRes = await fetch(djangoUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accesstoken}`,
      },
      body: JSON.stringify(body),
    });

    // Handle non-200 responses
    if (!djangoRes.ok) {
      const errorText = await djangoRes.text();
      console.error(`❌ Django Error (${djangoRes.status}):`, errorText);
      
      try {
        // Try parsing error as JSON
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(errorJson, { status: djangoRes.status });
      } catch (e) {
        // Fallback if Django sent HTML (common with 404/500)
        return NextResponse.json(
          { detail: "Server Error", raw: errorText }, 
          { status: djangoRes.status }
        );
      }
    }

    // Success
    const data = await djangoRes.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("💥 Proxy System Error:", error);
    return NextResponse.json(
      { detail: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}