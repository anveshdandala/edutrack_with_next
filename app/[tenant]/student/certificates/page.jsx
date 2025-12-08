import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Calendar, ExternalLink, Download } from "lucide-react";

import CertificateClientWrapper from "./certificate-client-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { serverFetch } from "@/lib/server-api";

export default async function CertificatesPage({ params }) {
  const { tenant } = await params;

  // 1. Fetch Real Data from Django
  // GET /api/{tenant}/achievements/certificates/
  const data = await serverFetch("/achievements/certificates", {
    tenant,
    cache: "no-store", // Ensure we always get the latest list
  });

  // Handle DRF pagination (if backend returns { results: [] } or just [])
  const certificates = Array.isArray(data) ? data : data?.results || [];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        
        {/* Navigation */}
        <Link href={`/${tenant}/student`}>
          <Button
            variant="ghost"
            className="mb-6 pl-0 hover:pl-2 transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Certificate Uploads</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your academic certificates for{" "}
            <span className="font-semibold text-primary">{tenant.toUpperCase()}</span>
          </p>
        </div>

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
            
            {certificates.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                <FileText className="h-10 w-10 mb-3 opacity-50" />
                <p>No certificates uploaded yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                {certificates.map((cert) => (
                  <Card key={cert.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="bg-primary/10 p-2 rounded-full">
                           <FileText className="h-5 w-5 text-primary" />
                        </div>
                        {/* Download/View Link */}
                        {cert.file_url && (
                          <Link href={cert.file_url} target="_blank" prefetch={false}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-medium truncate" title={cert.file_url}>
                           {/* Use backend name if available, else extract from URL */}
                           {cert.name || cert.file_url.split('/').pop() || "Certificate"}
                        </h3>
                        
                        {cert.created_at && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(cert.created_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

function UploadSkeleton() {
  return <Skeleton className="h-[250px] w-full rounded-xl" />;
}