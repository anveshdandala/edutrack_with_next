// middleware.js
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Extract Tenant from URL (Assuming structure: /:tenant/...)
  // path usually looks like: /vmeg/student/dashboard
  const pathParts = pathname.split("/");
  const tenant = pathParts[1]; // "vmeg"

  // 2. Get Tokens (Make sure names match your Login Route!)
  // Your login route set 'refreshtoken' (lowercase), so we must look for that.
  const accessToken = request.cookies.get("accesstoken")?.value;
  const refreshToken = request.cookies.get("refreshtoken")?.value;

  // 3. Scenario A: We have a valid Access Token
  // Just let them pass.
  if (accessToken) {
    return NextResponse.next();
  }

  // 4. Scenario B: Access Expired, but we have Refresh Token
  if (!accessToken && refreshToken && tenant) {
    console.log(`[Middleware] Access expired for ${tenant}. Refreshing...`);

    try {
      // Call the Tenant-Specific Refresh Endpoint
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

        // CRITICAL STRATEGY: "Refresh & Reload"
        // We redirect the user to the *exact same URL* they were trying to visit.
        // Why? This forces the browser to send a NEW request with the NEW cookie.
        // If we just used .next(), the Layout might still see the old (missing) cookie.
        const response = NextResponse.redirect(request.url);

        // Set the new Access Token on this redirect response
        response.cookies.set("accesstoken", newAccess, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24, // 1 Day (Align this with your Django settings)
        });

        return response;
      } else {
        console.error(
          "[Middleware] Refresh failed (401/400). Token likely invalid."
        );
        // If refresh fails, let code fall through to the Logout logic below
      }
    } catch (error) {
      console.error("[Middleware] Network error during refresh", error);
    }
  }

  // 5. Scenario C: No Tokens (Logged Out or Session Completely Dead)
  // Check if they are trying to access a protected page
  const isProtected =
    pathname.includes("/institution") ||
    pathname.includes("/student") ||
    pathname.includes("/admin") ||
    pathname.includes("/faculty");

  if (isProtected) {
    // Redirect to the global login or tenant login
    return NextResponse.redirect(new URL("/globalLogin", request.url));
  }

  return NextResponse.next();
}

// Only run on routes that actually need auth checking
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
