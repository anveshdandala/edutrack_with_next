import { Suspense } from "react";
import { DashboardHeader } from "@/components/student/dashboard-header"; // Assuming this is shared
import CertificateClientWrapper from "./certificate-client-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchServer } from "@/lib/server-api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
// Mock Data Fetching (Replace this with your actual DB/API call)
async function getCertificates() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

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
    // ... add rest of your data
  ];
}

export default async function CertificatesPage() {
  // Fetch data on the server
  const certificates = await getCertificates();
  const user = await fetchServer("/auth/users/me");

  return (
    <div className="min-h-screen bg-background">
      {/* Header can likely be server rendered or client, depending on implementation */}
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <Link href="/student">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Certificate Uploads</h1>
          <p className="text-muted-foreground">
            Upload and manage your academic certificates
          </p>
        </div>

        {/* We wrap the interactive parts in Suspense and a Client Component.
          We pass the server-fetched certificates as 'initialData'.
        */}
        <Suspense fallback={<CertificatesLoadingSkeleton />}>
          <CertificateClientWrapper
            user={user}
            initialCertificates={certificates}
          />
        </Suspense>
      </main>
    </div>
  );
}

function CertificatesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <div className="flex gap-4 overflow-hidden">
        <Skeleton className="h-[180px] w-[300px]" />
        <Skeleton className="h-[180px] w-[300px]" />
        <Skeleton className="h-[180px] w-[300px]" />
      </div>
    </div>
  );
}
