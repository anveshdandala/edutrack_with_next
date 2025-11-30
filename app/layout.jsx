import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider"; // See Step 4
import { fetchServer } from "@/lib/server-api";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
  // 1. Fetch User Server-Side
  let user = null;
  try {
    user = await fetchServer("/auth/users/me/");
  } catch (e) {
    // User is likely not logged in
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider initialUser={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
