"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { login } from "@/lib/auth.js";
import { useAuth } from "@/components/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputField from "@/components/common/InputField";
import CustomButton from "@/components/common/CustomButton";

export default function LoginPage({ tenantMeta }) {
  const router = useRouter();
  const { setUser } = useAuth();
  
  const [activeRole, setActiveRole] = useState("student");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // 1. Safely resolve the tenant slug
  const tenant = tenantMeta?.schema_name || "public";

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors.general) setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // --- Recruiter Bypass (Mock) ---
      if (activeRole === "recruiter") {
        await new Promise((r) => setTimeout(r, 800));
        const mockRecruiter = { id: "rec-1", username: formData.username, role: "RECRUITER" };
        if (setUser) setUser(mockRecruiter);
        router.push(`/${tenant}/rec`);
        return;
      }

      // --- Real Login ---
      // This calls our Next.js Proxy -> which calls Django
      console.log(`Logging in user: ${formData.username} to tenant: ${tenant}`);
      
      await login(formData.username, formData.password, tenant);

      // --- Fetch User Profile ---
      const res = await fetch(`/api/auth/me?tenant=${tenant}`);
      if (!res.ok) throw new Error("Could not retrieve user profile.");
      
      const user = await res.json();
      console.log("Login Success:", user);

      // --- Update Context & Redirect ---
      if (setUser) setUser(user);

      // Normalize role
      const role = (user.role || user.user_type || "").toUpperCase();
      
      // Refresh to ensure cookies are seen by server components
      router.refresh();

      // Intelligent Redirect
      if (role === "STUDENT") router.push(`/${tenant}/student`);
      else if (["FACULTY", "HOD"].includes(role)) router.push(`/${tenant}/faculty`);
      else if (["ADMIN", "INSTITUTION"].includes(role)) router.push(`/${tenant}/admin`);
      else {
        // Fallback for unknown roles
        console.warn("Unknown role:", role);
        router.push(`/${tenant}/dashboard`);
      }

    } catch (err) {
      console.error("Login Flow Error:", err);
      
      let msg = err.message || "Invalid credentials.";
      
      // Helpful error message for Schema Mismatches
      if (msg.toLowerCase().includes("no active account") || msg.includes("401")) {
         msg = `User not found in ${tenantMeta?.name || 'this college'}. Are you registered?`;
      }

      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <Link href="/">
          <button className="flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" /> Change College
          </button>
        </Link>

        <div className="max-w-md mx-auto">
          {/* Tenant Logo/Name Header */}
          {tenantMeta && (
            <div className="text-center mb-6">
              {tenantMeta.logo_url && (
                <img src={tenantMeta.logo_url} alt="Logo" className="mx-auto h-12 mb-2" />
              )}
              <h2 className="font-bold text-xl">{tenantMeta.name}</h2>
            </div>
          )}

          <Card className="shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Access your {activeRole} account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.general && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded flex items-center gap-2">
                   <span>⚠️ {errors.general}</span>
                </div>
              )}

              <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="faculty">Faculty</TabsTrigger>
                  <TabsTrigger value="institution">Inst.</TabsTrigger>
                  <TabsTrigger value="recruiter">Recr.</TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="Username"
                  placeholder="Enter your ID"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  required
                />
                <InputField
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />

                <CustomButton 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
                </CustomButton>
              </form>
            </CardContent>
            <CardFooter className="justify-center border-t p-4 bg-muted/50">
               <p className="text-xs text-muted-foreground">
                 Protected by EduTrack Security
               </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}