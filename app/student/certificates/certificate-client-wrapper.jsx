"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Ensure you have this
import { Label } from "@/components/ui/label"; // Optional, or use simple <label>
import {
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Loader2,
  File,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTenant } from "@/components/tenant/TenantProvider";
import { tenantApiPath } from "@/lib/routes";

export default function CertificateClientWrapper() {
  const tenant = useTenant();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(""); // 1. New State
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return; // 2. Validate Title

    setIsUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file_url", file);
    formData.append("title", title); // 3. Append Title

    try {
      const res = await fetch(tenantApiPath(tenant, "/upload-certificate"), {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }

      setStatus("success");
      setMessage("Certificate uploaded successfully!");
      setFile(null);
      setTitle(""); // Reset Title
      router.refresh();
    } catch (error) {
      console.error("Upload Error:", error);
      setStatus("error");
      setMessage(error.message || "Failed to upload certificate.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="h-full border-border shadow-none">
      <CardHeader className="pb-4">
        <div className="mb-2 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <UploadCloud size={20} />
        </div>
        <CardTitle>Upload Certificate</CardTitle>
        <CardDescription>
          Upload PDF/JPG (Max 5MB). AI will verify details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "success" && (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          {/* 4. Title Input Field */}
          <div className="space-y-2">
            <label
              htmlFor="cert-title"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Certificate Title
            </label>
            <Input
              id="cert-title"
              placeholder="e.g. AWS Cloud Practitioner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isUploading}
            />
          </div>

          {/* File Input Area */}
          <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border p-6 text-center transition-colors hover:bg-muted/50">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            {file ? (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <File className="mb-2 h-8 w-8 text-primary" />
                <p className="max-w-[200px] truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="mt-2 text-xs font-medium text-primary">
                  Click to change
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Click to Select File
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  or drag and drop here
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!file || !title.trim() || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload & Verify"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
