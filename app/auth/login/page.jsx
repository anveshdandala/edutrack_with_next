"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { login } from "@/lib/auth.js";
import { useAuth } from "@/components/AuthProvider"; // Assuming you still use Context for client-state
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

export default function LoginPage() {
  const { setUser } = useAuth(); // Optional: Update client context if you keep it
  const router = useRouter();

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

    try {
      await login(formData.username, formData.password);

      // 2. Fetch User Profile via Proxy (Client can't read cookie, so it asks server)
      const res = await fetch("/api/auth/me");
      console.log("[login] res:", res);

      if (!res.ok) {
        throw new Error(
          "Login succeeded, but failed to retrieve user profile."
        );
      }

      const me = await res.json();

      // 3. Update Client Context (Optional, for immediate UI updates)
      if (setUser) setUser(me);

      // 4. Validate Role
      const roleMap = {
        student: "STUDENT",
        faculty: "FACULTY", // Adjust based on your backend: "FACULTY" or "HOD"
        institution: "ADMIN", // Adjust based on backend
      };

      const expected = roleMap[activeRole];
      // Normalize backend role to uppercase string
      const actual = (me.role || me.user_type || me.type || "").toUpperCase();

      // Flexible check for Faculty/HOD overlap
      const isFacultyMatch =
        expected === "FACULTY" && (actual === "FACULTY" || actual === "HOD");
      const isMatch = actual === expected || isFacultyMatch;

      if (isMatch) {
        // 5. CRITICAL: Refresh router to update Server Components with new Cookie
        router.refresh();

        // 6. Redirect
        if (activeRole === "student") router.push("/student");
        else if (activeRole === "faculty") router.push("/faculty");
        else if (activeRole === "institution") router.push("/institution");
      } else {
        setErrors({
          general: `Logged in as ${actual}, but you are trying to access the ${activeRole} portal. Please switch tabs.`,
        });
        setIsSubmitting(false); // Stop loading so they can switch tabs
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: "Invalid username or password" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
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
