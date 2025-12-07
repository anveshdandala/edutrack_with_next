// middleware.js
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

// Helper to check if JWT is expired
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const [, payload] = token.split(".");
    if (!payload) return true;
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return false;
    // Buffer of 10s to be safe
    return decoded.exp * 1000 < Date.now() + 10000; 
  } catch (e) {
    return true;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const pathParts = pathname.split("/");
  const tenant = pathParts[1];

  const accessToken = request.cookies.get("accesstoken")?.value;
  const refreshToken = request.cookies.get("refreshtoken")?.value;

  // 1. Check if we have a VALID access token
  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  // 2. If no valid access token, but we have refresh token -> Refresh
  if ((!accessToken || isTokenExpired(accessToken)) && refreshToken && tenant) {
    console.log(`[Middleware] Access expired for ${tenant}. Refreshing...`);

    try {

      const refreshUrl = `${API_BASE}/api/${tenant}/auth/jwt/refresh/`;

      const res = await fetch(refreshUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        const newAccess = data.access;

        console.log("[Middleware] Refresh successful!");
        const response = NextResponse.redirect(request.url);

        response.cookies.set("accesstoken", newAccess, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60, // 1 hour
        });

        return response;
      } else {
        console.error(
          "[Middleware] Refresh failed (401/400). Token likely invalid."
        );
      }
    } catch (error) {
      console.error("[Middleware] Network error during refresh", error);
    }
  }

  const isProtected =
    pathname.includes("/institution") ||
    pathname.includes("/student") ||
    pathname.includes("/admin") ||
    pathname.includes("/faculty");

  if (isProtected) {
    return NextResponse.redirect(new URL("/globalLogin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - globalLogin (public page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|globalLogin).*)",
  ],
};
