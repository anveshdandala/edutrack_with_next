import { Skeleton } from "@/components/ui/skeleton";

export default function RecentCertificatesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-hidden">
        {/* Mocking 3 cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[280px] p-4 border rounded-xl bg-white space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
         <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}