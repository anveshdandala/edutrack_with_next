import { Suspense } from "react";
import { serverFetch } from "@/lib/server-api";
import InsightsClient from "./insights-client";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AdminInsightsPage({ params }) {
  const { tenant } = await params; // Next.js 15 Requirement

  const data = await serverFetch("/administration/academics-students/", {
    tenant,
    cache: "no-store",
  });

  // Ensure this is strictly an array (no functions/objects)
  const students = Array.isArray(data) ? data : data?.results || [];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Institution Insights</h1>
      </div>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <InsightsClient students={students} />
      </Suspense>
    </div>
  );
}