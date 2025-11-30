"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Upload,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Download,
  FileText,
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    setError(null);
    setSuccess(false);
    setDownloadUrl(null);
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("role", "STUDENT");

      const response = await fetch("/api/students/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = Object.entries(errorData)
          .map(
            ([key, msgs]) =>
              `${key}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
          )
          .join("\n");
        throw new Error(errorMessage || "Upload failed");
      }

      if (contentType && contentType.includes("text/csv")) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
        setSuccess(true);
        setSelectedFile(null);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/institution/students">
          <Button variant="ghost" className="gap-2 pl-0">
            <ArrowLeft className="w-4 h-4" />
            Back to Student List
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Students</CardTitle>
          <CardDescription>Upload bulk student data via CSV</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!success && (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
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

          {error && (
            <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm whitespace-pre-line">{error}</p>
            </div>
          )}

          {success && (
            <div className="space-y-4">
              <div className="flex gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-700">
                    Upload Successful!
                  </p>
                  <p className="text-sm text-green-600">
                    Download credentials below.
                  </p>
                </div>
              </div>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download="credentials.csv"
                  className="block w-full"
                >
                  <Button className="w-full gap-2">
                    <Download className="w-4 h-4" /> Download Credentials
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
