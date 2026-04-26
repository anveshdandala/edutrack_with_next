// app/api/profiles/bulk-upload/route.js
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { buildTenantApiUrl } from "@/lib/tenant";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function POST(request) {
  try {
    const headersList = await headers();

    // 1) STRICT TENANT RESOLUTION
    // We trust the middleware's x-tenant header. No searchParams needed anymore.
    const tenant = headersList.get("x-tenant");

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant header missing" },
        { status: 400 },
      );
    }

    // 2) AUTH CHECK
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3) FORWARD FORM DATA
    const incomingFormData = await request.formData();

    // 4) BUILD TARGET
    // Using your buildTenantApiUrl helper
    const targetUrl = buildTenantApiUrl(
      API_BASE,
      tenant,
      "/profiles/bulk-upload/",
    );

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-tenant": tenant,
      },
      body: incomingFormData,
      duplex: "half",
    });

    // 5) DYNAMIC RESPONSE HANDLING
    const contentType = res.headers.get("content-type") || "";

    // If it's a file (Excel credentials), stream it back to the user
    if (
      contentType.includes("application/vnd.openxmlformats-officedocument") ||
      contentType.includes("application/octet-stream")
    ) {
      const blob = await res.blob();
      return new NextResponse(blob, {
        status: res.status,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition":
            res.headers.get("content-disposition") ||
            'attachment; filename="credentials.xlsx"',
        },
      });
    }

    // If it's JSON (Errors or Success messages)
    if (contentType.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ success: res.ok }, { status: res.status });
  } catch (err) {
    console.error("[UploadProxy] Error:", err);
    return NextResponse.json(
      { error: "Internal proxy error" },
      { status: 500 },
    );
  }
}
