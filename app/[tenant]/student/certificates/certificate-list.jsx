"use strict";
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText, Calendar, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function CertificateList({ tenant }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const res = await fetch(`/api/get-certificates?tenant=${tenant}`);
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || `Error ${res.status}`);
        }
        const data = await res.json();
        // Handle DRF pagination or raw list
        const results = Array.isArray(data) ? data : data?.results || [];
        setCertificates(results);
      } catch (err) {
        console.error("Failed to load certificates:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (tenant) {
      fetchCertificates();
    }
  }, [tenant]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        <UploadSkeleton />
        <UploadSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Certificates</AlertTitle>
        <AlertDescription>
          {error === "Error 404" 
            ? "Server endpoint not found. Please contact support." 
            : "Could not connect to the server. Please check your connection."}
        </AlertDescription>
      </Alert>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50/50">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FileText className="text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-900">No Certificates</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
          You haven't uploaded any certificates yet. Use the form to add your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
      {certificates.map((cert) => (
        <Card key={cert.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col gap-3">
            {/* Top Row: Icon + Status */}
            <div className="flex justify-between items-start">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText size={18} />
              </div>
              {/* If you have a status field, render it here. */}
            </div>

            <div className="space-y-1">
              <h3 className="font-medium truncate" title={cert.file_url}>
                {cert.name || "Certificate File"}
              </h3>

              {cert.created_at && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(cert.created_at).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-auto pt-2 flex gap-2">
              <Button size="sm" variant="outline" className="w-full text-xs" asChild>
                <a href={cert.file_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={12} className="mr-2" /> View
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UploadSkeleton() {
  return <Skeleton className="h-[250px] w-full rounded-xl" />;
}
