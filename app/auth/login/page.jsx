import { headers } from "next/headers";
import LoginPage from "@/components/common/LoginPage";
import { fetchInstitutions } from "@/lib/publicApi";
import { serverFetch } from "@/lib/server-api";
export default async function LoginRoute() {
  const headersList = await headers();
  const tenant = headersList.get("x-tenant");

  let tenantMeta = null;
  let institutions = [];

  try {
    const data = await fetchInstitutions();
    institutions = Array.isArray(data) ? data : data?.results || [];
  } catch (e) {
    console.error("Failed to fetch institutions:", e);
  }

  if (tenant) {
    try {
      tenantMeta = await serverFetch("/institution/meta/", { tenant });
    } catch (e) {
      // tenant exists but no meta — fine, fallback to just showing tenant name
    }
  }

  return <LoginPage institutions={institutions} tenantMeta={tenantMeta} />;
}
