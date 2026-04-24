import { headers } from "next/headers";
import LoginPage from "@/components/common/LoginPage";
import { fetchInstitutionByTenant } from "@/lib/publicApi";

export default async function LoginRoute() {
  const headersList = await headers();
  const tenant = headersList.get("x-tenant");
  const tenantMeta = tenant ? await fetchInstitutionByTenant(tenant) : null;

  return <LoginPage tenant={tenant} tenantMeta={tenantMeta} />;
}
