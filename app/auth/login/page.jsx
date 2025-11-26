"use client";
import { useState } from "react";
import { login as apiLogin, fetchWithAuth } from "@/lib/auth.js";
import useAuth from "@/components/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputField from "@/components/common/InputField";
import CustomButton from "@/components/common/CustomButton";
import { set } from "date-fns";

export default function LoginPage() {
  const { user, loading, setUser } = useAuth();

  const [activeRole, setActiveRole] = useState("student");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState("student");

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await apiLogin(formData.username, formData.password);
      const me = await fetchWithAuth("http://127.0.0.1:8000/auth/users/me/", {
        method: "GET",
      });
      setUser(me);

      const roleMap = {
        student: "STUDENT",
        faculty: "FACULTY" || "HOD",
        institution: "ADMIN",
      };

      const expected = roleMap[activeRole];
      const actual = (me.role || me.user_type || me.type || "").toUpperCase();

      if (expected && actual === expected) {
        if (activeRole === "student") router.push("/student");
        else if (activeRole === "faculty") router.push("/faculty");
        else if (activeRole === "institution") router.push("/institution");
      } else {
        // mismatch
        setErrors({
          general:
            "Logged in but role does not match selected tab. Please choose the correct role tab or contact admin.",
        });
      }
    } catch (err) {
      setErrors({ general: err?.message ?? "Login failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="old-form">
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Link href="/">
              <button className="flex items-center gap-2 text-primary hover:underline mb-8">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </button>
            </Link>

            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
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
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="student">Student</TabsTrigger>
                      <TabsTrigger value="faculty">Faculty</TabsTrigger>
                      <TabsTrigger value="institution">Institution</TabsTrigger>
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
                          : "enter institution username"
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

                    {errors.general && (
                      <p className="text-center text-sm text-red-600 mt-2">
                        {errors.general}
                      </p>
                    )}

                    <div className="text-center space-y-2">
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
      </div>
    </>
  );
}
