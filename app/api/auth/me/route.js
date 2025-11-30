import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = "http://127.0.0.1:8000"; // Your Django URL

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const res = await fetch(`${BACKEND_URL}/auth/users/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: res.status }
    );
  }

  const user = await res.json();
  return NextResponse.json(user);
}
