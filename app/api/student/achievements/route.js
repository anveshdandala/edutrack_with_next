import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { buildTenantApiUrl, getTenantFromHost } from "@/lib/tenant";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

function resolveTenant(headersList, cookieStore) {
  return (
    headersList.get("x-tenant") ||
    cookieStore.get("tenant")?.value ||
    getTenantFromHost(headersList.get("host"))
  );
}

export async function GET(request) {
  const headersList = await headers();
  const cookieStore = await cookies();
  const token = cookieStore.get("accesstoken")?.value;
  const tenant = resolveTenant(headersList, cookieStore);

  if (!tenant) {
    return NextResponse.json({ error: "Tenant required" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    buildTenantApiUrl(API_BASE, tenant, "/achievements/student-achievements/"),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : { error: await res.text() };

  return NextResponse.json(data, { status: res.status });
}
