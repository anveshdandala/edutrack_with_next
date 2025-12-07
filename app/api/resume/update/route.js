import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_URL || "http://127.0.0.1:8000";

export async function PUT(request) {
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

    const { resume_id, tailored_content, template_style } = body;

    // Use specific update endpoint if ID is provided, otherwise generic update
    // Assuming backend endpoint is /api/{tenant}/resume/resume/{id}/ for updates?
    // Or back to /api/{tenant}/resume/update/ if that's what backend expects 
    // Based on user's manual fix attempt earlier, they tried to use /resume/resume/{id}/
    // But original code was /resume/update/. Let's stick generic update for now or try to use specific if ID present.
    // Actually, looking at ResumeClientWrapper, it sends `resume_id` in body.
    
    // Let's proxy to the generic update endpoint first as per original design
    let backendUrl = `${API_BASE}/api/${tenant}/resume/update/`;
    
    // If backend requires ID in URL for Update (PUT /resume/{id}/), we should switch.
    // But let's restore the original working PUT first.
    
    console.log(`[Proxy PUT] Updating resume at:`, backendUrl);

    const res = await fetch(backendUrl, {
      method: "PUT",
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
    console.error("Resume Update Proxy Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}