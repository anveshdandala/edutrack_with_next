"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ClientLayout({ children }) {
  const searchParams = useSearchParams();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey="student-dashboard-theme"
      >
        {children}
      </ThemeProvider>
    </Suspense>
  );
}
