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
import InputField from "@/components/common/InputField";
import CustomButton from "@/components/common/CustomButton";
import { ArrowLeft } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    admin_email: "",
    password: "",
    college_name: "",
    slug: "",
    contact: "",
    city: "",
    state: "",
    country: "India", // Defaulting to India
    pincode: "",
    street: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to generate slug from name (e.g., "Harvard University" -> "harvard")
  const handleNameChange = (name) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20);
    setFormData((prev) => ({ ...prev, college_name: name, slug: slug }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Auto-generate slug if the college_name is being changed
      if (field === "college_name") {
        newData.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-");
      }

      return newData;
    });

    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.admin_email)
      newErrors.admin_email = "Admin email is required";
    if (!formData.college_name)
      newErrors.college_name = "College name is required";
    if (!formData.slug) newErrors.slug = "Identifier (slug) is required";
    if (formData.password.length < 8) newErrors.password = "Min 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // No more .institution.name - just formData.college_name
      const payload = {
        college_name: formData.college_name,
        slug: formData.slug,
        admin_email: formData.admin_email,
        password: formData.password,
        contact: formData.contact,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        street: formData.street,
      };
      console.log("Sending payload:", payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/institution/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Server rejected request:", data);
        // Display specific errors if they exist
        const errorMsg = Object.entries(data)
          .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
          .join("\n");
        alert(`Registration failed:\n${errorMsg}`);
      } else {
        alert(
          "Institution registered successfully! Check email for activation.",
        );
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Register Institution</CardTitle>
            <CardDescription>
              This will create a dedicated database for your college.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Institution Name"
                value={formData.college_name}
                onChange={(e) =>
                  handleInputChange("college_name", e.target.value)
                }
                error={errors.college_name}
              />

              <InputField
                label="System Identifier (Slug)"
                placeholder="e.g. harvard"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                error={errors.slug}
                description="This will be used for your unique URL."
              />

              <InputField
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                error={errors.city}
              />

              <InputField
                label="State"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                error={errors.state}
              />
              <InputField
                label="pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                error={errors.pincode}
              />
              <InputField
                label="contact"
                value={formData.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                error={errors.contact}
              />

              <InputField
                label="Admin Email"
                type="email"
                value={formData.admin_email}
                onChange={(e) =>
                  handleInputChange("admin_email", e.target.value)
                }
                error={errors.admin_email}
              />

              <InputField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={errors.password}
              />

              <CustomButton
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Environment..." : "Register Now"}
              </CustomButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
