"use client";

import { useState, useEffect } from "react";
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
  
  // State structure optimized for the form UI
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    institution: {
      name: "",
      slug: "", // Added: Required by backend
      country: "",
      state: "",
      city: "",
      pincode: "",
      contact: "",
      street: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Auto-generate Slug from Institution Name ---
  useEffect(() => {
    const name = formData.institution.name;
    if (name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      
      setFormData((prev) => ({
        ...prev,
        institution: { ...prev.institution, slug: generatedSlug },
      }));
    }
  }, [formData.institution.name]);

  // --- Handle Input Changes ---
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleInstitutionChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      institution: { ...prev.institution, [field]: value },
    }));
    // Clear specific nested error if it exists
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // --- Validation ---
  const validateForm = () => {
    const newErrors = {};

    // User validations
    if (!formData.email) newErrors.admin_email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8) newErrors.password = "Min 8 characters required";

    // Institution validations
    const inst = formData.institution;
    if (!inst.name) newErrors.name = "Institution name is required";
    if (!inst.slug) newErrors.slug = "Slug is required";
    if (!inst.city) newErrors.city = "City is required";
    if (!inst.state) newErrors.state = "State is required";
    if (!inst.country) newErrors.country = "Country is required";
    if (!inst.pincode) newErrors.pincode = "Pincode is required";
    if (!inst.contact) newErrors.contact = "Contact is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Handle Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({}); // Clear previous server errors

    try {
      // 1. Map Frontend State to Backend API Fields (Flat Structure)
      const apiPayload = {
        college_name: formData.institution.name,
        slug: formData.institution.slug,
        contact: formData.institution.contact,
        city: formData.institution.city,
        state: formData.institution.state,
        country: formData.institution.country,
        pincode: formData.institution.pincode,
        
        // User fields mapped to backend expectations
        admin_email: formData.email,
        password: formData.password,
      };

      console.log("Sending Payload:", apiPayload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/public/register-college/`, // Note the trailing slash
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            // "Connection": "close" // Uncomment if using Django runserver and it hangs
          },
          body: JSON.stringify(apiPayload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Registration failed:", data);
        // Map Django DRF errors (which come as arrays) to our error state
        // Example DRF Error: { "slug": ["This slug already exists."] }
        const serverErrors = {};
        Object.keys(data).forEach((key) => {
            // Map backend 'college_name' to frontend 'name'
            const frontendKey = key === 'college_name' ? 'name' : key;
            serverErrors[frontendKey] = Array.isArray(data[key]) ? data[key][0] : data[key];
        });
        setErrors(serverErrors);
        const errorMsg = Object.values(serverErrors).join("\\n");
        alert(`Registration failed:\\n${errorMsg}`);
      } else {
        console.log("Success:", data);
        router.push("/globalLogin");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error. Ensure backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <button className="flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Register Your College</h1>
            <p className="text-muted-foreground mt-2">
              Create a tenant account for your institution.
            </p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Institution Details</CardTitle>
              <CardDescription>
                These details will be used to generate your college URL.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Institution Section */}
                <div className="space-y-4">
                  <InputField
                    label="Institution Name"
                    placeholder="e.g., Vardhaman College of Engineering"
                    value={formData.institution.name}
                    onChange={(e) => handleInstitutionChange("name", e.target.value)}
                    required
                    error={errors.name}
                  />

                  {/* Slug - Auto Generated but Editable */}
                  <div className="grid grid-cols-1 gap-2">
                    <InputField
                      label="College URL Slug (Unique ID)"
                      placeholder="vc"
                      value={formData.institution.slug}
                      onChange={(e) => handleInstitutionChange("slug", e.target.value)}
                      required
                      error={errors.slug} 
                    />
                    <p className="text-xs text-muted-foreground mt-3">
                      Your URL will be: app.edutrack.com/<strong>{'your-slug'}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Country"
                      value={formData.institution.country}
                      onChange={(e) => handleInstitutionChange("country", e.target.value)}
                      required
                      error={errors.country}
                    />
                     <InputField
                      label="State"
                      value={formData.institution.state}
                      onChange={(e) => handleInstitutionChange("state", e.target.value)}
                      required
                      error={errors.state}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <InputField
                      label="City"
                      value={formData.institution.city}
                      onChange={(e) => handleInstitutionChange("city", e.target.value)}
                      required
                      error={errors.city}
                    />
                    <InputField
                      label="Pincode"
                      value={formData.institution.pincode}
                      onChange={(e) => handleInstitutionChange("pincode", e.target.value)}
                      required
                      error={errors.pincode}
                    />
                  </div>

                  <InputField
                    label="Contact Number"
                    value={formData.institution.contact}
                    onChange={(e) => handleInstitutionChange("contact", e.target.value)}
                    required
                    error={errors.contact}
                  />
                  
                  <InputField
                    label="Street Address"
                    value={formData.institution.street}
                    onChange={(e) => handleInstitutionChange("street", e.target.value)}
                    required
                    error={errors.street}
                  />
                </div>

                {/* Admin User Section */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-semibold text-lg">Admin Credentials</h3>
                  <p className="text-sm text-muted-foreground -mt-3 mb-2">This user will be the Super Admin (Principal).</p>

                  <InputField
                    label="Admin Email"
                    type="email"
                    placeholder="principal@college.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    error={errors.admin_email}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="First Name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                    />
                    <InputField
                      label="Last Name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                    />
                  </div>
                  
                  <InputField
                    label="Username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    error={errors.username}
                  />

                  <InputField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    error={errors.password}
                  />
                </div>

                <CustomButton
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register Institution"}
                </CustomButton>

                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Already registered?{" "}
                    <Link
                      href="/globalLogin"
                      className="text-primary hover:underline"
                    >
                      Login here
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