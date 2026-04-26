"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useTenant } from "@/components/tenant/TenantProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputField from "@/components/common/InputField";
import CustomButton from "@/components/common/CustomButton";

const ROLE_REDIRECTS = {
  STUDENT: "/student",
  FACULTY: "/faculty/dashboard",
  ADMIN: "/institution/dashboard",
  INSTITUTION: "/institution/dashboard",
  RECRUITER: "/recruiter/dashboard",
};

function getInstitutionTenant(institution) {
  return institution?.slug || institution?.schema_name || institution?.tenant;
}

function getInstitutionName(institution) {
  return (
    institution?.name ||
    institution?.college_name ||
    institution?.institution_name ||
    getInstitutionTenant(institution)
  );
}

export default function LoginPage({ institutions = [], tenantMeta }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const tenant = useTenant();

  const [activeRole, setActiveRole] = useState("student");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [selectedTenant, setSelectedTenant] = useState(tenant || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const loginTenant = selectedTenant;

      if (!loginTenant) {
        throw new Error("Please select your college before logging in.");
      }

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant": loginTenant,
        },
        body: JSON.stringify({
          tenant: loginTenant,
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!loginRes.ok) {
        const data = await loginRes.json();
        throw new Error(data?.detail || data?.error || "Invalid credentials.");
      }

      const meRes = await fetch("/api/auth/me", {
        headers: { "x-tenant": loginTenant },
      });
      if (!meRes.ok) throw new Error("Could not retrieve user profile.");

      const user = await meRes.json();
      setUser(user);
      router.push(ROLE_REDIRECTS[user.role] || "/auth/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <Link
          href={process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}
        >
          <button className="flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" /> Change College
          </button>
        </Link>

        <div className="max-w-md mx-auto">
          {/* <div className="text-center mb-6">
            {tenantMeta?.logo_url && (
              <img
                src={tenantMeta.logo_url}
                alt="Logo"
                className="mx-auto h-12 mb-2"
              />
            )}
            <h2 className="font-bold text-xl">
              {tenantMeta?.name || tenant || "EduTrack"}
            </h2>
          </div> */}

          <Card className="shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Access your {activeRole} account
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
                  {error}
                </div>
              )}

              <Tabs
                value={activeRole}
                onValueChange={setActiveRole}
                className="w-full mb-6"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="faculty">Faculty</TabsTrigger>
                  <TabsTrigger value="institution">admin</TabsTrigger>
                  <TabsTrigger value="recruiter">Recr.</TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-4">
                {institutions.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">College</label>
                    <select
                      value={selectedTenant}
                      onChange={(e) => setSelectedTenant(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Select your college</option>
                      {institutions.map((institution) => {
                        const value = getInstitutionTenant(institution);

                        if (!value) return null;

                        return (
                          <option key={value} value={value}>
                            {getInstitutionName(institution)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <InputField
                  label="Username"
                  placeholder="Enter your ID"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, username: e.target.value }))
                  }
                  required
                />
                <InputField
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, password: e.target.value }))
                  }
                  required
                />

                <CustomButton
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Sign In"
                  )}
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
