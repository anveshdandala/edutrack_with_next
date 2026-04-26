import Link from "next/link";
import { serverFetch } from "@/lib/server-api";
import {
  FileText,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const getStatusConfig = (status) => {
  switch (status) {
    case "VERIFIED":
    case "MANUAL_VERIFIED":
      return {
        color: "bg-emerald-100 text-emerald-700",
        icon: CheckCircle2,
        label: "Verified",
      };
    case "PENDING":
      return {
        color: "bg-amber-100 text-amber-700",
        icon: Clock,
        label: "Pending",
      };
    case "REJECTED":
      return {
        color: "bg-red-100 text-red-700",
        icon: ShieldAlert,
        label: "Rejected",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-700",
        icon: FileText,
        label: "Draft",
      };
  }
};

export default async function RecentCertificates({ tenant }) {
  // 1. Server-Side Fetch (Same Django endpoint as your client fetch)
  const data = await serverFetch("/achievements/certificates", {
    tenant,
    cache: "no-store", // Ensure fresh data on every dashboard load
  });

  // 2. Data Handling
  const certificates = Array.isArray(data) ? data : data?.results || [];
  console.log(data);
  // Limit to recent 3 items for the dashboard view
  const recentItems = certificates.slice(0, 3);

  if (recentItems.length === 0) {
    return (
      <div className="rounded-md border border-dashed bg-muted/40 py-8 text-center">
        <p className="mb-2 text-sm text-muted-foreground">
          No certificates uploaded yet.
        </p>
        <Link href="/student/certificates">
          <Button variant="outline" size="sm">
            Upload Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
        {recentItems.map((cert) => {
          const status = getStatusConfig(cert.status);
          const StatusIcon = status.icon;

          return (
            <Link
              key={cert.id}
              href="/student/certificates"
              className="min-w-[280px] snap-center"
            >
              <Card className="h-full cursor-pointer border-border shadow-none transition-colors hover:bg-accent group">
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className={`p-1.5 rounded-full ${status.color}`}>
                      <StatusIcon size={14} />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div>
                    <h4
                      className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-accent-foreground transition-colors"
                      title={cert.title}
                    >
                      {cert.title || "Untitled"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {cert.issuing_organization || "Unknown Issuer"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Link href="/student/certificates">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-primary hover:text-primary"
          >
            View All Certificates <ChevronRight size={14} className="ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
