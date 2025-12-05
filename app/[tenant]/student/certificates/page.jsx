import { Suspense } from "react";
import CertificateClientWrapper from "./certificate-client-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { serverFetch } from "@/lib/server-api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
// import { DashboardHeader } from "@/components/student/dashboard-header"; // Uncomment if you have this component

// Mock Data Fetching (Simulating API delay)
async function getCertificates() {
  await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay for realism

  return [
    {
      id: 1,
      type: "seminars",
      name: "AI Workshop Certificate",
      link: "https://example.com/cert1",
      date: "2024-02-15",
      issuer: "Tech Academy",
    },
    {
      id: 2,
      type: "conferences",
      name: "IEEE Conference 2024",
      link: "https://example.com/cert2",
      date: "2024-01-20",
      issuer: "IEEE",
    },
    {
      id: 3,
      type: "internships",
      name: "Summer Intern @ Google",
      link: "https://example.com/cert3",
      date: "2023-08-30",
      issuer: "Google",
    },
  ];
}

export default async function CertificatesPage({ params }) {
  // 1. Get Tenant from URL for Navigation Links
  const { tenant } = await params;

  const user = await serverFetch("/auth/users/me/", {
    tenant,
  });
  const certificates = await getCertificates();

  return (
    <div className="min-h-screen bg-background">
      {/* <DashboardHeader user={user} /> */}

      <main className="container mx-auto px-4 py-8">
        {/* Dynamic Back Link using 'tenant' */}
        <Link href={`/${tenant}/student`}>
          <Button
            variant="ghost"
            className="mb-6 pl-0 hover:pl-2 transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Certificate Uploads</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your academic certificates for{" "}
            {tenant.toUpperCase()}
          </p>
        </div>

        <Suspense fallback={<CertificatesLoadingSkeleton />}>
          <CertificateClientWrapper
            user={user}
            initialCertificates={certificates}
            tenant={tenant} // Pass tenant if client wrapper needs it for uploads
          />
        </Suspense>
      </main>
    </div>
  );
}

function CertificatesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-[120px] rounded-xl" />
        <Skeleton className="h-[120px] rounded-xl" />
        <Skeleton className="h-[120px] rounded-xl" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}
