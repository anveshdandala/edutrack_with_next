import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import CertificateClientWrapper from "./certificate-client-wrapper";
import CertificateList from "./certificate-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { tenantPath } from "@/lib/routes";

export default async function CertificatesPage() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const tenant = headersList.get("x-tenant") || cookieStore.get("tenant")?.value;

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Navigation tenant={tenant} />
        <Header tenant={tenant} />

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload New</h2>
            <Suspense fallback={<UploadSkeleton />}>
              <CertificateClientWrapper tenant={tenant} />
            </Suspense>
          </div>

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
    <Link href={tenantPath(tenant, "/student")}>
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
        <span className="font-semibold text-primary">
          {tenant?.toUpperCase() || "YOUR COLLEGE"}
        </span>
      </p>
    </div>
  );
}

function UploadSkeleton() {
  return <Skeleton className="h-[250px] w-full rounded-md" />;
}
