// components/auth/LoginPage.jsx  (client component; your existing code moved here)
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { login } from "@/lib/auth.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputField from "@/components/common/InputField";
import CustomButton from "@/components/common/CustomButton";
export default function LoginPage({ tenantMeta }) {
  const router = useRouter();
  const { setUser } = useAuth();
  console.log("[LoginPage] tenant ", tenantMeta);

  const [activeRole, setActiveRole] = useState("student");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // tenant from server-provided meta (safe)
    const tenant =
      tenantMeta?.schema_name ||
      (typeof window !== "undefined" && window.location.pathname.split("/")[1]);
    console.log("submitted with tenant:", tenant);

    if (activeRole === "recruiter") {
      // Mock login for recruiter
      await new Promise((resolve) => setTimeout(resolve, 800)); // fake delay

      // Sample data
      const mockRecruiter = {
        id: "rec-mock-001",
        username: formData.username,
        role: "RECRUITER",
        name: "Mock Recruiter",
        email: "recruiter@example.com",
      };

      console.log("Mock Recruiter Login:", mockRecruiter);
      if (setUser) setUser(mockRecruiter);

      // Redirect to recruiter dashboard
      router.push(`/${tenant}/rec`);
      return;
    }

    try {
      // 1) authenticate (backend ideally sets HttpOnly cookies)
      await login(formData.username, formData.password, tenant);

      const res = await fetch(`/api/auth/me?tenant=${tenant}`);

      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const user = await res.json();
      console.log("Fetched User:", user);

      // 3. Update Global Context (Optional but recommended)
      if (setUser) setUser(user);

      // 4. Determine Redirect Path based on Role
      // Normalize role to uppercase to avoid case issues
      const role = (
        user.role ||
        user.user_type ||
        user.type ||
        ""
      ).toUpperCase();

      // Refresh to ensure server components get the new cookie
      router.refresh();

      // 5. Intelligent Redirect
      if (role === "STUDENT") {
        router.push(`/${tenant}/student`);
      } else if (role === "FACULTY" || role === "HOD") {
        router.push(`/${tenant}/faculty`);
      } else if (role === "ADMIN" || role === "INSTITUTION") {
        router.push(`/${tenant}/admin`);
      } else {
        // Fallback or error if role is unknown
        console.warn("Unknown role:", role);
        setErrors({ general: "Login successful, but unknown user role." });
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("login error:", err);
      // show backend error message if available
      const msg =
        err?.body?.detail ||
        (err.message && err.message !== "Failed to fetch"
          ? err.message
          : "Invalid username or password");
      setErrors({ general: msg });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <Link href="/globalLogin">
          <button className="flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" />
            Change college
          </button>
        </Link>

        <div className="max-w-md mx-auto">
          {/* render tenant info at top */}
          {tenantMeta && (
            <div className="text-center mb-6">
              {tenantMeta.logo_url ? (
                <img
                  src={tenantMeta.logo_url}
                  alt={tenantMeta.name}
                  className="mx-auto h-12 mb-2"
                />
              ) : null}
              <div className="font-semibold">{tenantMeta.name}</div>
              <div className="text-sm text-gray-500">{tenantMeta.domain}</div>
            </div>
          )}

          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your account
            </p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Select your role and enter your credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.general && (
                <div className="mb-4 text-sm text-red-800 bg-red-50 border border-red-200 p-3 rounded">
                  {errors.general}
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
                  <TabsTrigger value="institution">Inst.</TabsTrigger>
                  <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="Username"
                  placeholder={
                    activeRole === "student"
                      ? "Enter your student username"
                      : activeRole === "faculty"
                      ? "Enter your faculty username"
                      : activeRole === "recruiter"
                      ? "Enter recruiter username"
                      : "Enter institution username"
                  }
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  required
                  error={errors.username}
                />

                <InputField
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                  error={errors.password}
                />

                <CustomButton
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </CustomButton>

                <div className="text-center space-y-2 mt-4">
                  <Link
                    href="#"
                    className="block text-sm text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Not registered yet?{" "}
                    <Link
                      href="/register-college"
                      className="text-primary hover:underline"
                    >
                      Register your college
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
