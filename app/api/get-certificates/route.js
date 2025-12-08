import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_URL || "http://127.0.0.1:8000";

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

    // Construct Django URL
    const cleanBase = API_BASE.replace(/\/$/, "");
    // Trying the same logical endpoint, assuming the user might have fixed backend or we'll debug the 404 here
    const djangoUrl = `${cleanBase}/api/${tenant}/achievements/certificates/`; 

    console.log(`[Proxy] Fetching certificates from: ${djangoUrl}`);

    const res = await fetch(djangoUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Proxy] Django Error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch certificates from backend." }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("[Proxy] Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
