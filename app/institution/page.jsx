import { fetchServer } from "@/lib/server-api"; // Your server fetcher
import { redirect } from "next/navigation";
import InstitutionDashboardUI from "./dashboard-ui"; // Move your existing UI here

export default async function InstitutionPage() {
  // 1. Check Auth on the Server
  let user = null;
  try {
    user = await fetchServer("/auth/users/me/");
  } catch (e) {
    // If fetch fails (401), redirect to login
    redirect("/login");
  }

  // 2. Check Role (Security)
  // Adjust "ADMIN" to whatever your backend actually calls the Institution role
  if (!user || (user.role !== "ADMIN" && user.role !== "INSTITUTION")) {
    redirect("/login?error=unauthorized");
  }

  // 3. Pass data to the UI if needed, or just render it
  return <InstitutionDashboardUI user={user} />;
}
