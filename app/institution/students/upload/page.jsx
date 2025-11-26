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
import useAuth from "@/components/useAuth";

export default function StudentUploadPage() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // New state to store the generated file URL
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    setError(null);
    setSuccess(false);
    setDownloadUrl(null); // Reset download link on new file selection
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
      const access = localStorage.getItem("accesstoken");
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("role", "STUDENT");
      formData.append("body", user?.collegeCode || user?.id || "");

      const response = await fetch(
        "http://127.0.0.1:8000/create-bulk-profiles",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access}`,
          },
          body: formData,
        }
      );

      // 1. Check if the response is JSON (Error) or CSV (Success)
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        // If error, it's likely JSON error details
        const errorData = await response.json();
        console.error("Server Validation Error:", errorData);

        const errorMessage = Object.entries(errorData)
          .map(
            ([key, msgs]) =>
              `${key}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
          )
          .join("\n");

        throw new Error(errorMessage || "Upload failed");
      }

      // 2. If successful, the server returns a CSV file (Blob)
      if (contentType && contentType.includes("text/csv")) {
        const blob = await response.blob();

        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
        setSuccess(true);
        setSelectedFile(null); // Optional: clear file input
      } else {
        setSuccess(true);
      }
    } catch (err) {
      if (err?.status === 401) {
        setError("Unauthorized — please login again.");
      } else {
        setError(err?.message ?? String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/institution/students">
          <Button
            variant="ghost"
            className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Student List
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Students</CardTitle>
          <CardDescription>
            Upload bulk student data via CSV or Excel file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Input Area */}
          {!success && (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer relative">
              <label className="cursor-pointer block w-full h-full">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {selectedFile
                      ? selectedFile.name
                      : "Click to select or drag file"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Supports: CSV, XLS, XLSX
                  </span>
                </div>
                <input
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive whitespace-pre-line">
                {error}
              </p>
            </div>
          )}

          {/* Success & Download Section */}
          {success && (
            <div className="space-y-4">
              <div className="flex gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg items-start">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-green-700">
                    Upload Successful!
                  </p>
                  <p className="text-sm text-green-600">
                    Your students have been processed. Please download the
                    credentials file below.
                  </p>
                </div>
              </div>

              {downloadUrl && (
                <div className="p-4 border rounded-lg bg-secondary/20 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">credentials.csv</p>
                      <p className="text-xs text-muted-foreground">
                        Contains generated login details
                      </p>
                    </div>
                  </div>
                  <a
                    href={downloadUrl}
                    download="credentials.csv"
                    className="w-full"
                  >
                    <Button className="w-full gap-2" variant="default">
                      <Download className="w-4 h-4" />
                      Download Credentials
                    </Button>
                  </a>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setSuccess(false);
                  setDownloadUrl(null);
                }}
                className="w-full"
              >
                Upload Another File
              </Button>
            </div>
          )}

          {/* Upload Button (Only show if not success) */}
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
