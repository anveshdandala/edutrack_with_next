import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

export async function POST(request) {
  try {
    // 1. Get Tenant
    const { searchParams } = new URL(request.url);
    const tenant = searchParams.get("tenant");
    if (!tenant)
      return NextResponse.json({ error: "Tenant required" }, { status: 400 });

    // 2. Get Secure Token
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 3. Get the incoming FormData
    const formData = await request.formData();

    // 4. Send to Django
    // Ensure this path matches your Django URL configuration
    const targetUrl = `${API_BASE}/api/${tenant}/administration/upload-students/`;

    console.log(`[Proxy] Uploading to: ${targetUrl}`);

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        // Do NOT set Content-Type here.
        // fetch() will automatically generate the multipart boundary when body is FormData.
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // 5. Handle Response (Django usually returns a CSV file on success)
    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    // 6. Return the File (CSV) or JSON back to the client
    if (contentType && contentType.includes("text/csv")) {
      const blob = await res.blob();
      return new NextResponse(blob, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="credentials.csv"',
        },
      });
    }

    // Fallback for JSON success
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[Proxy] Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
