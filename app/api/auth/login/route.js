import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function POST(request) {
  const body = await request.json();
  const { username, password } = body;

  console.log("👉 Login Route: Attempting login for", username);
  console.log(
    "👉 Target URL:",
    `${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/create/`
  );

  try {
    const res = await fetch(`${BACKEND_URL}/auth/jwt/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // Read the text first (safe parsing)
    const responseText = await res.text();
    console.log(`👉 Django Response (${res.status}):`, responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      // If it's HTML (Crash page), return the text
      return NextResponse.json(
        { error: "Server Error: " + responseText },
        { status: 500 }
      );
    }

    if (!res.ok) {
      // Return the FULL error object so we can see it in the browser
      return NextResponse.json(data, { status: res.status });
    }

    // --- Success Logic ---
    const { access, refresh } = data;
    const cookieStore = cookies();
    cookieStore.set("accesstoken", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    cookieStore.set("refreshtoken", refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true, user: data }, { status: 200 });
  } catch (error) {
    console.error("Login Route Critical Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
