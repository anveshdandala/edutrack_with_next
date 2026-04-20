import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { serverFetch } from "@/lib/server-api"; // Note: Ensure name matches your lib file

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accesstoken")?.value;

  let user = null;

  // 1. Only attempt to fetch the user if a token actually exists
  if (token) {
    try {
      // NOTE: serverFetch now requires a 'tenant' object.
      // If you are on a public page, you might need to skip this
      // or provide the public/default tenant.
      user = await serverFetch("/auth/users/me/", {
        tenant: "public", // Replace with your logic to determine the active tenant
      });
    } catch (e) {
      console.error("Failed to fetch user with existing token:", e);
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* We wrap children in AuthProvider to keep the user state accessible */}
        <AuthProvider initialUser={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
