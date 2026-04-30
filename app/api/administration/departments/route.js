import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { buildTenantApiUrl, getTenantFromHost } from "@/lib/tenant";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export async function POST(request) {
  const body = await request.json();
  const headersList = await headers();
  const tenant =
    headersList.get("x-tenant") || getTenantFromHost(headersList.get("host"));

  if (!tenant) {
    return NextResponse.json({ error: "Tenant required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accesstoken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const targetUrl = buildTenantApiUrl(
    API_BASE,
    tenant,
    "/administration/departments/",
  );

  const res = await fetch(targetUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-tenant": tenant,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : { error: await res.text() };

  return NextResponse.json(data, { status: res.status });
}
export async function GET(request) {
  try {
    const headersList = await headers();
    const tenant = headersList.get("x-tenant");

    const cookieStore = await cookies();
    const token = cookieStore.get("accesstoken")?.value;

    if (!tenant || !token) {
      return NextResponse.json(
        { error: "Unauthorized or missing tenant" },
        { status: 401 },
      );
    }

    // 1. Extract query strings from the incoming Next.js request
    // e.g., if frontend calls /api/departments?search=CS, searchString will be "?search=CS"
    const { search } = new URL(request.url);

    // 2. Build the Django URL and append the search string
    // CHANGE "/your/django/endpoint/" to match whatever this route is for!
    const targetUrl = buildTenantApiUrl(
      API_BASE,
      tenant,
      `/administration/departments/`,
    );

    // 3. Forward to Django
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-tenant": tenant,
        "Content-Type": "application/json",
      },
      // Note: GET requests cannot have a 'body'
    });

    // 4. Handle the response
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[GET Proxy Error]:", error);
    return NextResponse.json(
      { error: "Internal proxy error" },
      { status: 500 },
    );
  }
}
