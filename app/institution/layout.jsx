import { headers } from "next/headers";
import { redirect } from "next/navigation";
import InstitutionShell from "@/components/institution/InstitutionShell";
import { serverFetch } from "@/lib/server-api";

const ALLOWED_ROLES = new Set(["ADMIN", "INSTITUTION"]);

export default async function InstitutionLayout({ children }) {
  const headersList = await headers();
  const tenant = headersList.get("x-tenant");
  const user = await serverFetch("/auth/users/me/", { tenant });

  if (!user) {
    redirect("/auth/login");
  }

  if (!ALLOWED_ROLES.has(user.role)) {
    redirect("/auth/login");
  }

  return <InstitutionShell user={user}>{children}</InstitutionShell>;
}
