import { headers } from "next/headers";
import InstitutionDashboardUI from "@/components/institution/dashboard";
import { fetchServer } from "@/lib/server-api";
import { getUser } from "@/lib/auth-cache";
export default async function InstitutionPage() {
  const headersList = await headers();
  const tenant = headersList.get("x-tenant");
  const user = await getUser();

  return <InstitutionDashboardUI user={user} />;
}
