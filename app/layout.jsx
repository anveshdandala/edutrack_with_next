import { cookies } from "next/headers";
import { headers } from "next/headers";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { serverFetch } from "@/lib/server-api"; // Note: Ensure name matches your lib file
import { ThemeProvider } from "@/components/ThemeProvider";
import { TenantProvider } from "@/components/tenant/TenantProvider";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const headersList = await headers();
  const tenant = headersList.get("x-tenant") || cookieStore.get("tenant")?.value;
  const token = cookieStore.get("accesstoken")?.value;

  let user = null;

  // 1. Only attempt to fetch the user if a token actually exists
  if (token && tenant) {
    try {
      user = await serverFetch("/auth/users/me/", {
        tenant,
      });
    } catch (e) {
      console.error("Failed to fetch user with existing token:", e);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <TenantProvider tenant={tenant}>
            <AuthProvider initialUser={user}>{children}</AuthProvider>
          </TenantProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
