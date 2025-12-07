import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import LinearProgress from "@mui/material/LinearProgress";
import HodsList from "./hod-list";

export const dynamic = "force-dynamic";

export default async function HodsListPage({ params }) {
  const { tenant } = await params;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header Section (Static, Loads Instantly) */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">HOD Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage department heads
          </p>
        </div>
        <Link href={`/${tenant}/admin/hods/create`}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create HOD
          </Button>
        </Link>
      </div>

      {/* Async Content Wrapped in Suspense */}
      <Suspense fallback={<HodsSkeleton />}>
        <HodsList tenant={tenant} />
      </Suspense>
    </div>
  );
}

// Skeleton Component with Top Loader
function HodsSkeleton() {
  return (
    <>
      {/* Top Loading Bar */}
      <div className="fixed top-0 left-0 w-full z-[9999]">
        <LinearProgress color="primary" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4 bg-card">
            {/* Dept Skeleton */}
            <div className="border-b pb-3">
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Name/Email Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Button Skeleton */}
            <Skeleton className="h-9 w-full rounded-md mt-2" />
          </div>
        ))}
      </div>
    </>
  );
}
