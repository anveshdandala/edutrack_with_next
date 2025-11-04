"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { ArrowLeft } from "lucide-react";

export default function login() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState("student");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate login
      console.log("Login attempt:", { role: activeRole, ...formData });
      setTimeout(() => {
        setIsSubmitting(false);
        if (activeRole === "student") {
          router.push("/student");
        } else {
          router.push("/faculty-dashboard");
        }
      }, 1500);
    }
  };

  return (
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
              <Tabs
                value={activeRole}
                onValueChange={setActiveRole}
                className="w-full mb-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="faculty">Faculty</TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="Username"
                  placeholder={
                    activeRole === "student"
                      ? "Enter your student username"
                      : "Enter your faculty username"
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
  );
}
