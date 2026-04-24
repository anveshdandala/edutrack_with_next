// lib/publicApi.js
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export async function fetchInstitutions() {
  const res = await fetch(`${API_BASE}/public/institution/`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch institutions");
  return res.json();
}

export async function fetchInstitutionByTenant(tenant) {
  if (!tenant) return null;

  try {
    const institutions = await fetchInstitutions();
    return (
      institutions.find(
        (institution) =>
          institution.schema_name === tenant || institution.slug === tenant,
      ) ?? null
    );
  } catch (error) {
    console.error("fetchInstitutionByTenant failed:", error);
    return null;
  }
}
