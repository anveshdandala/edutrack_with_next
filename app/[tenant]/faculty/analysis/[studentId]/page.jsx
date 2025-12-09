import { Suspense } from "react";
import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/server-api";
import StudentAnalysisUI from "./student-analysis-ui";
import AnalysisSkeleton from "./analysis-skeleton";

// 1. Data Fetcher
async function StudentAnalysisContent({ tenant, studentId }) {
  // Fetch detailed student data using the ID
  // Endpoint: GET /administration/student-details/{id}/
  const studentData = await serverFetch(`/administration/student-details/${studentId}/`, {
    tenant,
    cache: "no-store",
  });

  if (!studentData) {
    return notFound();
  }

  return <StudentAnalysisUI student={studentData} tenant={tenant} />;
}

// 2. Main Page Component
export default async function StudentAnalysisPage({ params }) {
  // Unwrap params in Next.js 15
  const resolvedParams = await params;
  const { tenant, studentId } = resolvedParams;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Suspense fallback={<AnalysisSkeleton />}>
        <StudentAnalysisContent tenant={tenant} studentId={studentId} />
      </Suspense>
    </div>
  );
}