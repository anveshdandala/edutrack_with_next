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

  const targetUrl = buildTenantApiUrl(API_BASE, tenant, "/profiles/hods/");

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
