import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalysisSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex gap-4 mb-8">
         <Skeleton className="h-10 w-32" />
         <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-24" />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
               <Skeleton className="h-24 rounded-xl" />
               <Skeleton className="h-24 rounded-xl" />
            </div>
         </div>
         <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[350px] w-full rounded-xl" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
         </div>
      </div>
    </div>
  );
}