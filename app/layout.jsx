import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import ClientLayout from "./client-layout";
import "./globals.css";
import { Suspense } from "react";

import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "Student Dashboard",
  description: "Academic management dashboard for students",
  generator: "v0.app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <ClientLayout>{children}</ClientLayout>
          </Suspense>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
