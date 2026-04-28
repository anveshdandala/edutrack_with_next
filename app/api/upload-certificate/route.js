import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { buildTenantApiUrl, getTenantFromHost } from "@/lib/tenant";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

function resolveTenant(request, headersList, cookieStore) {
  const { searchParams } = new URL(request.url);

  return (
    headersList.get("x-tenant") ||
    searchParams.get("tenant") ||
    cookieStore.get("tenant")?.value ||
    getTenantFromHost(headersList.get("host"))
  );
}

export async function POST(request) {
  const headersList = await headers();
  const cookieStore = await cookies();
  const token = cookieStore.get("accesstoken")?.value;
  const tenant = resolveTenant(request, headersList, cookieStore);

  if (!tenant) {
    return NextResponse.json({ error: "Tenant required" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const incomingFormData = await request.formData();
  const outgoingFormData = new FormData();
  const file = incomingFormData.get("file_url") || incomingFormData.get("file");

  if (file) {
    outgoingFormData.append("file_url", file);
  }

  const res = await fetch(
    buildTenantApiUrl(API_BASE, tenant, "/achievements/certificates/upload/"),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: outgoingFormData,
      duplex: "half",
    },
  );

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : { error: await res.text() };

  return NextResponse.json(data, { status: res.status });
}
