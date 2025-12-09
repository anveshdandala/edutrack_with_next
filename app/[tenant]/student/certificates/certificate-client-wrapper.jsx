"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, CheckCircle, AlertCircle, Loader2, File } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CertificateClientWrapper({ tenant }) {
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
    if (!file) return;

    setIsUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file_url", file); 

    try {
      const res = await fetch(`/api/upload-certificate?tenant=${tenant}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }

      setStatus("success");
      setMessage("Certificate uploaded! AI analysis in progress...");
      setFile(null); 
      
      // Force refresh so the new cert appears in the list on the right
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
    <Card className="h-full border-blue-100 shadow-sm">
      <CardHeader className="pb-4">
        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2 text-blue-600">
            <UploadCloud size={20} />
        </div>
        <CardTitle>Upload Certificate</CardTitle>
        <CardDescription>
          Upload PDF, JPG or PNG. Max size 5MB.
          <br/>
          <span className="text-xs text-blue-600 font-medium">AI will auto-verify details.</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
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

        <form onSubmit={handleUpload} className="space-y-4">
          {/* Custom Styled File Input Area */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
            <input 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            
            {file ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <File className="text-blue-500 h-8 w-8 mb-2" />
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">Click to change</p>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <UploadCloud className="text-gray-300 h-8 w-8 mb-2" />
                    <p className="text-sm font-medium text-gray-600">Click to Select File</p>
                    <p className="text-xs text-gray-400 mt-1">or drag and drop here</p>
                </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading & Analyzing...
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