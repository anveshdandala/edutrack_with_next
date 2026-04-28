import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

const DJANGO_PORT = process.env.DJANGO_PORT || "8000";

export async function POST(request) {
  try {
    const headersList = await headers();
    const cookieStore = await cookies();

    const tenant = headersList.get("x-tenant");
    const token = cookieStore.get("accesstoken")?.value;

    if (!tenant) return NextResponse.json({ error: "Tenant missing" }, { status: 400 });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    const res = await fetch(`http://${tenant}.localhost:${DJANGO_PORT}/resume/generate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (err) {
    console.error("[Resume Generate]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}