// app/[tenant]/institution/page.jsx (or admin/page.jsx)
import { serverFetch } from "@/lib/server-api";
import { redirect } from "next/navigation";
import InstitutionDashboardUI from "./dashboard-ui";

export default async function InstitutionPage({ params }) {
  // 1. Get the Tenant (REQUIRED for serverFetch)
  const { tenant } = await params;

  // 2. Check Auth on the Server
  let user = null;
  try {
    user = await serverFetch("/auth/users/me/", {
      tenant,
      cache: "no-store",
    });
  } catch (e) {
    console.error("Institution Page Fetch Error:", e);
    redirect("/globalLogin");
  }

  // 3. Check Role (Security)
  // Ensure we handle case sensitivity
  const role = (user?.role || user?.user_type || "").toUpperCase();
  console.log("user", user);

  if (!user || (role !== "ADMIN" && role !== "INSTITUTION")) {
    // Redirect to authorized dashboard if they are just a student
    if (role === "STUDENT") redirect(`/${tenant}/student`);

    redirect("/globalLogin?error=unauthorized");
  }

  // 4. Pass data to the UI
  return <InstitutionDashboardUI user={user} />;
}
