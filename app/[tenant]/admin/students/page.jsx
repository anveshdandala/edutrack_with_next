import { Suspense } from "react";
import StudentList from "./student-list";
import { Skeleton } from "@/components/ui/skeleton";
import LinearProgress from "@mui/material/LinearProgress"; // Import the bar

export const dynamic = "force-dynamic";

export default async function StudentsPage({ params }) {
  const { tenant } = await params;

  return (
    <div className="container mx-auto px-6 py-8 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Students Directory</h1>
        <p className="text-gray-500">Manage student records for {tenant}</p>
      </div>

      {/* The fallback prop is what shows while data fetches.
         We add the Progress Bar HERE so it shows together with the Skeleton.
      */}
      <Suspense fallback={<StudentListSkeleton />}>
        <StudentList tenant={tenant} />
      </Suspense>
    </div>
  );
}

// Update the Skeleton to include the Top Bar
function StudentListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="fixed top-0 left-0 w-full z-[9999]">
        <LinearProgress color="primary" />
      </div>

      {/* 2. THE SKELETON UI */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[30%]" />
              <Skeleton className="h-4 w-[20%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
