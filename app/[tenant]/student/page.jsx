// app/[tenant]/student/page.js
import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/server-api"; // <--- Fixed Import Name
import StudentDashboardUI from "./dashboard-ui";

export default async function StudentPage({ params }) {
  // 1. Get the tenant from the URL (e.g., 'vmeg')
  const { tenant } = await params;

  let user = null;

  try {
    // 2. Pass the tenant to the helper
    // This runs ON THE SERVER, so it can read the HttpOnly cookie
    user = await serverFetch("/auth/users/me/", { tenant });

    console.log("[student] user found:", user.username);
  } catch (e) {
    console.error("Failed to fetch user:", e.message);
    // If unauthorized, go back to login
    redirect(`/${tenant}/login`);
  }

  if (!user) redirect(`/${tenant}/login`);

  return <StudentDashboardUI user={user} />;
}
