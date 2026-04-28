import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import CertificateClientWrapper from "./certificate-client-wrapper";
import CertificateList from "./certificate-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import StudentShell from "@/components/student/StudentShell";

export default async function CertificatesPage() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const tenant = headersList.get("x-tenant") || cookieStore.get("tenant")?.value;

  return (
    <StudentShell>
      <Navigation />
      <Header tenant={tenant} />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Upload New</h2>
          <Suspense fallback={<UploadSkeleton />}>
            <CertificateClientWrapper tenant={tenant} />
          </Suspense>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Your Certificates</h2>
          <CertificateList tenant={tenant} />
        </section>
      </div>
    </StudentShell>
  );
}

// --- Helper Components to reduce code duplication ---

function Navigation() {
  return (
    <Link href="/student">
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
