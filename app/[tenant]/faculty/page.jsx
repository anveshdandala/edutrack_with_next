import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import FacultyDashboardUI from "@/components/faculty/FacultyDashboardUI";
import DashboardSkeleton from "@/components/faculty/DashboardSkeleton";
import { serverFetch } from "@/lib/server-api";

async function DashboardContent({ tenant }) {
  // 1. Parallel Fetching: Get Students AND Certificates
  const studentsReq = serverFetch("/administration/faculty-students/", {
    tenant,
    cache: "no-store",
  });

  const certificatesReq = serverFetch("/achievements/certificates", {
    tenant,
    cache: "no-store",
  });

  const [studentsData, certificatesData] = await Promise.all([studentsReq, certificatesReq]);

  // 2. Safe Parsing
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
  const resolvedParams = await params;
  const { tenant } = resolvedParams;

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuthButtons={false} />
      <Suspense fallback={<MainSkeletonWrapper />}>
        <DashboardContent tenant={tenant} />
      </Suspense>
    </div>
  );
}

function MainSkeletonWrapper() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-64 bg-gray-200 rounded mb-8 animate-pulse" />
      <DashboardSkeleton />
    </div>
  );
}