"use client";

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="student-dashboard-theme"
    >
      {children}
    </ThemeProvider>
  );
}
