// app/api/students/upload/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function POST(request) {
  // 1. Get FormData from the Client Request
  const formData = await request.formData();

  // 2. Get Token from Cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("accesstoken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 3. Forward to Django
    // NOTE: We do NOT set 'Content-Type': 'multipart/form-data' manually.
    // fetch() does it automatically with the correct boundary.
    const res = await fetch(`${BACKEND_URL}/create-bulk-profiles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Pass the FormData object directly
    });

    // 4. Handle Response Type (JSON Error vs CSV File)
    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    // 5. If it's a CSV file, stream it back to the client
    const blob = await res.blob();
    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType || "text/csv",
        "Content-Disposition":
          res.headers.get("content-disposition") ||
          'attachment; filename="credentials.csv"',
      },
    });
  } catch (error) {
    console.error("Upload Proxy Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
