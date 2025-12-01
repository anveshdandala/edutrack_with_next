// app/api/create-hod/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("👉 Proxy: Starting Create HOD request...");

  // 1. Check Authentication
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accesstoken")?.value;

  if (!accessToken) {
    console.error("❌ Proxy: No access token found.");
    return NextResponse.json(
      { detail: "Unauthorized: No session token" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    console.log("👉 Proxy: Forwarding payload to Django:", body);

    // 2. Forward to Django
    // Ensure this URL matches your Django URL EXACTLY
    const djangoRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/create-hod`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    // 3. Handle Response Safely (Prevent Crashes)
    const contentType = djangoRes.headers.get("content-type");

    if (!djangoRes.ok) {
      console.error(`❌ Proxy: Django Error (${djangoRes.status})`);

      // If JSON, return it
      if (contentType && contentType.includes("application/json")) {
        const errorJson = await djangoRes.json();
        console.error("❌ Django Error Detail:", errorJson);
        return NextResponse.json(errorJson, { status: djangoRes.status });
      }

      // If HTML/Text (Crash page), read as text
      const errorText = await djangoRes.text();
      console.error(
        "❌ Django returned non-JSON:",
        errorText.substring(0, 200)
      );
      return NextResponse.json(
        { detail: `Server Error: ${djangoRes.status} ${djangoRes.statusText}` },
        { status: djangoRes.status }
      );
    }

    // Success
    const data = await djangoRes.json();
    console.log("✅ Proxy: Success!", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("💥 Proxy System Error:", error);
    return NextResponse.json(
      { detail: "Connection failed: " + error.message },
      { status: 500 }
    );
  }
}
