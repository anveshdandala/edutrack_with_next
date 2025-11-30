// middleware.js
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function middleware(request) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. If we have a valid access token, let them pass
  if (accessToken) {
    return NextResponse.next();
  }

  // 2. If Access is gone, but Refresh exists -> Try to Refresh
  if (!accessToken && refreshToken) {
    console.log("Middleware: Access token expired, refreshing...");
    try {
      const res = await fetch(`${BACKEND_URL}/auth/jwt/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        const newAccess = data.access;

        // Clone the response so we can modify cookies
        const response = NextResponse.next();

        // Set the new Access Token
        response.cookies.set("accessToken", newAccess, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 15, // 15 mins
        });

        return response;
      }
    } catch (error) {
      console.error("Middleware refresh failed", error);
    }
  }

  // 3. If we are here, the user is logged out (No access, no valid refresh)
  // If they are trying to access a protected page, kick them to login
  const isProtected =
    request.nextUrl.pathname.startsWith("/institution") ||
    request.nextUrl.pathname.startsWith("/student");

  if (isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Only run on specific routes to save performance
export const config = {
  matcher: ["/institution/:path*", "/student/:path*", "/faculty/:path*"],
};
