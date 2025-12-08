import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CertificateClientWrapper from "./certificate-client-wrapper";
import CertificateList from "./certificate-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default async function CertificatesPage({ params }) {
  const { tenant } = await params;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Navigation tenant={tenant} />
        <Header tenant={tenant} />

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          
          {/* Left Column: Upload Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload New</h2>
            <Suspense fallback={<UploadSkeleton />}>
              <CertificateClientWrapper tenant={tenant} />
            </Suspense>
          </div>

          {/* Right Column: List of Certificates */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Certificates</h2>
            <CertificateList tenant={tenant} />
          </div>

        </div>
      </main>
    </div>
  );
}

// --- Helper Components to reduce code duplication ---

function Navigation({ tenant }) {
  return (
    <Link href={`/${tenant}/student`}>
      <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
    </Link>
  );
}

function Header({ tenant }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">Certificate Uploads</h1>
      <p className="text-muted-foreground mt-2">
        Upload and manage your academic certificates for{" "}
        <span className="font-semibold text-primary">{tenant.toUpperCase()}</span>
      </p>
    </div>
  );
}

function UploadSkeleton() {
  return <Skeleton className="h-[250px] w-full rounded-xl" />;
}