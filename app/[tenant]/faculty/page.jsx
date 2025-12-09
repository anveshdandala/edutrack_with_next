import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import FacultyDashboardUI from "@/components/faculty/FacultyDashboardUI";
import DashboardSkeleton from "@/components/faculty/DashboardSkeleton";
import { serverFetch } from "@/lib/server-api";

async function DashboardContent({ tenant }) {
  // 1. Fetch Students
  const studentsReq = serverFetch("/administration/faculty-students/", {
    tenant,
    cache: "no-store",
  });

  // 2. Fetch Certificates (Ensure trailing slash!)
  const certificatesReq = serverFetch("/achievements/certificates/", {
    tenant,
    cache: "no-store",
  });

  const [studentsData, certificatesData] = await Promise.all([studentsReq, certificatesReq]);

  // 3. Handle Empty/Error Responses Safely
  // If fetch fails, serverFetch returns null.
  const students = Array.isArray(studentsData) ? studentsData : studentsData?.results || [];
  const certificates = Array.isArray(certificatesData) ? certificatesData : certificatesData?.results || [];

  return (
    <FacultyDashboardUI 
      tenant={tenant} 
      students={students} 
      certificates={certificates} 
    />
  );
}

export default async function FacultyPage({ params }) {
  const { tenant } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuthButtons={false} />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent tenant={tenant} />
      </Suspense>
    </div>
  );
}