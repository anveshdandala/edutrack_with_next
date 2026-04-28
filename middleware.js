import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
const DJANGO_PORT = process.env.DJANGO_PORT || "8000";

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const [, payload] = token.split(".");
    if (!payload) return true;
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return false;
    return decoded.exp * 1000 < Date.now() + 10000;
  } catch (e) {
    return true;
  }
}

function getTenant(request) {
  const host = request.headers.get("host") || "";
  const subdomain = host.split(".")[0];
  const isBase = !host.includes(".") || subdomain === "www";
  return isBase ? null : subdomain;
}

const PROTECTED = ["/student", "/faculty", "/institution", "/admin"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const tenant = getTenant(request); // only from subdomain

  // Set x-tenant header for all downstream use
  const requestHeaders = new Headers(request.headers);
  if (tenant) {
    requestHeaders.set("x-tenant", tenant);
  } else {
    requestHeaders.delete("x-tenant");
  }

  const accessToken = request.cookies.get("accesstoken")?.value;
  const refreshToken = request.cookies.get("refreshtoken")?.value;

  // Valid token → proceed
  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Try refresh
  if ((!accessToken || isTokenExpired(accessToken)) && refreshToken && tenant) {
    try {
      const res = await fetch(
        `http://${tenant}.localhost:${DJANGO_PORT}/auth/jwt/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        },
      );

      if (res.ok) {
        const { access } = await res.json();
        const response = NextResponse.redirect(request.url, {
          request: { headers: requestHeaders },
        });
        response.cookies.set("accesstoken", access, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60,
        });
        return response;
      }
    } catch (error) {
      console.error("[Middleware] Refresh failed:", error);
    }
  }

  // Protect routes
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (isProtected) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
    // stays on tce.localhost:3000/auth/login ✓
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|globalLogin).*)"],
};
