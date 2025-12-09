
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase } from "lucide-react";

export default function RecentInternshipsSkeleton() {
  return (
    <div>
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Briefcase className="text-blue-600" size={20} /> Internships
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 w-full">
                         <Skeleton className="w-14 h-14 rounded-lg bg-gray-100" />
                         <div className="space-y-2 flex-1">
                             <Skeleton className="h-5 w-40 bg-gray-100" />
                             <Skeleton className="h-4 w-32 bg-gray-50" />
                         </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                         <Skeleton className="h-8 w-16 rounded-lg bg-gray-50" />
                         <Skeleton className="h-8 w-24 rounded-lg bg-gray-50" />
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
