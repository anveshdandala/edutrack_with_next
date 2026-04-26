import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/server-api";
import StudentDashboardUI from "@/components/student/dashboard-ui";
import { cookies, headers } from "next/headers";
import { Suspense } from "react";
import RecentCertificates from "@/components/student/dashboard/recent-certificates";
import RecentCertificatesSkeleton from "@/components/student/dashboard/recent-certificates-skeleton";
import RecentInternships from "@/components/student/dashboard/recent-internships";
import RecentInternshipsSkeleton from "@/components/student/dashboard/recent-internships-skeleton";

export default async function StudentPage() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const tenant =
    headersList.get("x-tenant") || cookieStore.get("tenant")?.value;

  let user = null;

  try {
    user = await serverFetch("/auth/users/me/", { tenant });

    if (user) {
      console.log("[student] user found:", user.username);
    }
  } catch (e) {
    console.error("Failed to fetch user:", e.message);
    redirect("/auth/login");
  }

  if (!user) redirect("/auth/login");

  return (
    <StudentDashboardUI
      user={user}
      tenant={tenant}
      certificatesSlot={
        <Suspense fallback={<RecentCertificatesSkeleton />}>
          <RecentCertificates tenant={tenant} />
        </Suspense>
      }
      internshipsSlot={
        <Suspense fallback={<RecentInternshipsSkeleton />}>
          <RecentInternships tenant={tenant} />
        </Suspense>
      }
    />
  );
}
