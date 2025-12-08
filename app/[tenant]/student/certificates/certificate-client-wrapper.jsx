"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CertificateClientWrapper({ tenant }) {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null); // Reset status on new file
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setStatus(null);

    // 1. Create FormData
    const formData = new FormData();
    // CRITICAL: The backend expects 'file_url' based on your schema
    formData.append("file_url", file); 

    try {
      // 2. Send to Next.js Proxy (NOT directly to Django, because we need Cookies)
      const res = await fetch(`/api/upload-certificate?tenant=${tenant}`, {
        method: "POST",
        body: formData, // fetch automatically sets Content-Type to multipart/form-data
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }

      const data = await res.json();
      console.log("Upload Success:", data);
      
      setStatus("success");
      setMessage("Certificate uploaded successfully!");
      setFile(null); // Clear input
      
      // Optional: Refresh page to show new list if you have one
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
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Upload New Certificate</CardTitle>
        <CardDescription>
          Supported formats: PDF, JPG, PNG. Max size: 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Status Alerts */}
        {status === "success" && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
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

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Input 
              id="cert-file" 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Certificate
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}