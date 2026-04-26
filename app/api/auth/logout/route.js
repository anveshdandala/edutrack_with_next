import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("accesstoken");
  cookieStore.delete("refreshtoken");
  cookieStore.delete("tenant");
  return NextResponse.json({ success: true });
}
