"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Upload,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentUploadPage() {
  const params = useParams();
  const tenant = params?.tenant;

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState("credentials.csv");

  const handleFileChange = (e) => setSelectedFile(e.target.files?.[0] ?? null);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("role", "STUDENT");

      const response = await fetch(`/api/students/upload?tenant=${tenant}`, {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      // 1. Handle JSON Errors (Explicit errors from backend)
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          const msg = Object.entries(data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
            .join("\n");
          throw new Error(msg || data.error || "Upload failed");
        }
        // If JSON success (no file returned)
        setSuccess(true);
      }
      // 2. Handle File Responses (CSV/Excel/Zip)
      // This catches the "PK" data
      else {
        if (!response.ok)
          throw new Error(`Upload failed with status: ${response.status}`);

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);

        // Detect extension based on content type or default to Excel (common for PK header)
        if (contentType.includes("csv")) {
          setDownloadName("credentials.csv");
        } else if (contentType.includes("zip")) {
          setDownloadName("credentials.zip");
        } else {
          // Default fallback for Excel/OpenOffice formats
          setDownloadName("credentials.xlsx");
        }

        setSuccess(true);
        setSelectedFile(null);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <div className="mb-6">
        <Link href={`/${tenant}/admin/students`}>
          <Button variant="ghost" className="gap-2 pl-0">
            <ArrowLeft className="w-4 h-4" /> Back to Student List
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Students</CardTitle>
          <CardDescription>
            Upload bulk student data (CSV/Excel)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Input */}
          {!success && (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors">
              <label className="cursor-pointer block w-full h-full">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {selectedFile
                      ? selectedFile.name
                      : "Click to select or drag file"}
                  </span>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm whitespace-pre-line">{error}</p>
            </div>
          )}

          {/* Success & Download */}
          {success && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">Upload Successful!</p>
                  {downloadUrl ? (
                    <p className="text-sm">Credentials file generated.</p>
                  ) : (
                    <p className="text-sm">Profiles created.</p>
                  )}
                </div>
              </div>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={downloadName}
                  className="block w-full"
                >
                  <Button className="w-full gap-2">
                    <Download className="w-4 h-4" /> Download {downloadName}
                  </Button>
                </a>
              )}

              <Button
                variant="outline"
                onClick={() => setSuccess(false)}
                className="w-full"
              >
                Upload Another
              </Button>
            </div>
          )}

          {/* Submit Button */}
          {!success && (
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className="w-full"
            >
              {loading ? "Uploading..." : "Upload Students"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
