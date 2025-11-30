import { fetchServer } from "@/lib/server-api";
import { redirect } from "next/navigation";
import StudentDashboardUI from "./dashboard-ui";

export default async function StudentPage() {
  let user = null;

  try {
    const data = await fetchServer("/auth/users/me/");
    user = data;
    console.log("[student] user:", user);
  } catch (e) {
    redirect("/auth/login");
  }

  if (!user) redirect("/auth/login");

  return <StudentDashboardUI user={user} />;
}
