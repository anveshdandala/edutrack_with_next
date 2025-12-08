"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomButton from "@/components/common/CustomButton";

export default function ActivationPage() {
  const { uid, token } = useParams();
  const router = useRouter();
  
  // Status states: 'loading', 'success', 'error'
  const [status, setStatus] = useState("loading");
  const hasRun = useRef(false); // Prevent double-firing in React Strict Mode

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const activateAccount = async () => {
      try {
        // NOTE: This usually hits the Public schema because the tenant isn't logged in yet.
        // If your architecture requires tenant-specific activation, 
        // you might need to extract the tenant slug from the URL or headers.
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/users/activation/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid, token }),
        });

        if (!res.ok) {
          throw new Error("Invalid token or expired link.");
        }

        setStatus("success");
        
        // Optional: Auto-redirect after 3 seconds
        // setTimeout(() => router.push("/auth/login"), 3000);
        
      } catch (error) {
        console.error("Activation failed:", error);
        setStatus("error");
      }
    };

    if (uid && token) {
      activateAccount();
    }
  }, [uid, token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader>
          <CardTitle className="flex flex-col items-center gap-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <span>Activating Account...</span>
              </>
            )}
            
            {status === "success" && (
              <>
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <span className="text-2xl text-green-700">Activation Successful!</span>
              </>
            )}

            {status === "error" && (
              <>
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <span className="text-2xl text-red-700">Activation Failed</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {status === "loading" && (
            <p className="text-muted-foreground">
              Please wait while we verify your credentials.
            </p>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Your institution account is now active. You can log in with your credentials.
              </p>
              <Link href="/auth/login">
                <CustomButton className="w-full">
                  Go to Login <ArrowRight className="ml-2 h-4 w-4" />
                </CustomButton>
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This link may be invalid or has already been used.
              </p>
              <Link href="/contact-support">
                <button className="text-primary hover:underline font-medium">
                  Contact Support
                </button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}