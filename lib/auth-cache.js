// lib/auth-cache.js
import { cache } from "react";
import { serverFetch } from "@/lib/server-api";
import { cookies, headers } from "next/headers";

export const getUser = cache(async () => {
  const headersList = await headers();
  const cookieStore = await cookies();
  const tenant = headersList.get("x-tenant") || cookieStore.get("tenant")?.value;

  if (!tenant) return null;

  try {
    return await serverFetch("/auth/users/me/", { tenant });
  } catch {
    return null;
  }
});
