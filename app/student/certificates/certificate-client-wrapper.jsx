"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle, AlertCircle, Loader2, File as FileIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CertificateClientWrapper() {
  const router = useRouter();
  const [file, setFile] = useState(null);
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
    
    if (!file) {
      setStatus("error");
      setMessage("Please select a file to upload.");
      return; 
    }

    setIsUploading(true);
    setStatus(null);

    // EXACTLY what Swagger expects: a multipart form with one key: "file_url"
    const formData = new FormData();
    formData.append("file_url", file);

    try {
      // Sending to Next.js API proxy
      const res = await fetch("/api/achievements/certificates/upload", {
        method: "POST",
        body: formData, 
        // NOTE: Never set "Content-Type" manually when sending FormData.
        // The browser automatically sets it with the correct "boundary" hash.
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.detail || "Upload failed");
      }

      setStatus("success");
      setMessage("Certificate uploaded and sent to AI for verification!");
      setFile(null);
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
                <FileIcon className="mb-2 h-8 w-8 text-primary" />
                <p className="max-w-[200px] truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Click to Select File
                </p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!file || isUploading}>
            {isUploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              "Upload & Verify"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}