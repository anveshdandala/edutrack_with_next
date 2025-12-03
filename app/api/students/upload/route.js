// app/api/students/upload/route.js  (server)
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://127.0.0.1:8000";

function log(...args) {
  // small wrapper so you can easily remove/replace logs
  console.log("[UploadProxy]", ...args);
}

export async function POST(request) {
  try {
    // 1) get tenant from query param, cookie, or referer (in that order)
    const { searchParams } = new URL(request.url);
    let tenant = searchParams.get("tenant");
    if (!tenant) {
      try {
        const cs = await cookies();
        tenant = cs.get("tenant")?.value;
      } catch (e) {
        // ignore
      }
    }
    if (!tenant) {
      const referer = request.headers.get("referer") || "";
      const m = referer.match(/^https?:\/\/[^\/]+\/([^\/]+)/);
      tenant = m?.[1] ?? null;
    }
    if (!tenant) {
      return NextResponse.json({ error: "Tenant required" }, { status: 400 });
    }

    // 2) get token from cookie store (HttpOnly)
    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      console.log("token", token);
    }

    // 3) read incoming FormData and rebuild outgoing FormData
    const incomingFormData = await request.formData();
    const outgoingFormData = new FormData();
    for (const [key, value] of incomingFormData.entries()) {
      // If the value is a File, it's preserved; FormData supports File objects.
      outgoingFormData.append(key, value);
    }

    // 4) build tenant backend URL
    const targetUrl = `${API_BASE}/api/${tenant}/administration/create-bulk-profiles/`;
    log("Forwarding upload to:", targetUrl);

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type — fetch will set the multipart boundary for FormData
      },
      body: outgoingFormData,
      duplex: "half", // required in Next.js/Node 18+ when forwarding FormData
      // cache: "no-store" // optional
    });

    // 5) handle response types
    const contentType = res.headers.get("content-type") || "";
    log("Upstream status:", res.status, "content-type:", contentType);

    // If upstream returns a file (CSV, xlsx, zip, octet-stream), stream it back
    if (
      contentType.includes("text/csv") ||
      contentType.includes("application/zip") ||
      contentType.includes("application/octet-stream") ||
      contentType.includes("application/vnd.openxmlformats-officedocument") ||
      contentType.includes("application/vnd.ms-excel") ||
      contentType.includes("application/force-download")
    ) {
      const blob = await res.blob();
      const disposition =
        res.headers.get("content-disposition") ||
        'attachment; filename="credentials"';
      return new NextResponse(blob, {
        status: res.status,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": disposition,
        },
      });
    }

    // If JSON
    if (
      contentType.includes("application/json") ||
      contentType.includes("application/problem+json")
    ) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    // Unknown response (HTML error page etc.)
    const text = await res.text();
    log(
      "Upstream returned non-json/non-file response (first 300 chars):",
      text.slice(0, 300)
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error", details: text.slice(0, 1000) },
        { status: res.status }
      );
    }

    // fallback success
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[UploadProxy] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal proxy error", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
