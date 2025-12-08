import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_URL || "http://127.0.0.1:8000";

export async function POST(request) {
  try {
    // 1. Get Tenant and Token
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

    // 2. Get the FormData from the Client Request
    const formData = await request.formData();

    // 3. Construct Django URL
    // Ensure we strip trailing slash from base, but add one for Django if needed
    const cleanBase = API_BASE.replace(/\/$/, "");
    const djangoUrl = `${cleanBase}/api/${tenant}/achievements/upload-certificate`; 
    // Note: Added trailing slash as per Django convention

    console.log(`[Proxy] Uploading to: ${djangoUrl}`);

    // 4. Forward to Django
    // Note: We DO NOT set 'Content-Type' header manually. 
    // Fetch with FormData automatically sets boundaries.
    const res = await fetch(djangoUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "multipart/form-data" // <--- DO NOT DO THIS. Let fetch handle it.
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Proxy] Django Error:", errorText);
      return NextResponse.json(
        { error: "Backend rejected the file. Check formats/size." }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("[Proxy] Upload Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}