// lib/publicApi.js
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export async function fetchInstitutions() {
  const res = await fetch(`${API_BASE}/public/institutions/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch institutions");
  return res.json();
}
