// app/api/select-tenant/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // defensively parse JSON (req.json() may throw)
    let body;
    try {
      body = await req.json();
    } catch (parseErr) {
      console.error("select-tenant: failed to parse JSON body:", parseErr);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { schema, name } = body || {};

    if (!schema || typeof schema !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid schema" },
        { status: 400 }
      );
    }

    // Build a response and set cookies via NextResponse (works in route handlers)
    const res = NextResponse.json({ ok: true });

    // set readable tenant cookie (not HttpOnly) so server and client can read it
    res.cookies.set({
      name: "tenant",
      value: schema,
      path: "/",
      sameSite: "lax",
      // secure: process.env.NODE_ENV === "production", // enable in prod
      // maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // optional metadata cookie
    res.cookies.set({
      name: "tenant_name",
      value: (name && String(name)) || schema,
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error("select-tenant error:", err);
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        { error: "internal", message: err.message, stack: err.stack },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
