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
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    institution: {
      name: "",
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

  // --- handle input changes ---
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleInstitutionChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      institution: { ...prev.institution, [field]: value },
    }));
    if (errors[`institution_${field}`])
      setErrors((prev) => ({ ...prev, [`institution_${field}`]: "" }));
  };

  // --- validation ---
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.username) newErrors.username = "Username is required";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";

    // institution details
    const inst = formData.institution;
    if (!inst.name) newErrors.institution_name = "Institution name is required";
    if (!inst.country) newErrors.institution_country = "Country is required";
    if (!inst.state) newErrors.institution_state = "State is required";
    if (!inst.city) newErrors.institution_city = "City is required";
    if (!inst.pincode) newErrors.institution_pincode = "Pincode is required";
    if (!/^\d{5,6}$/.test(inst.pincode))
      newErrors.institution_pincode = "Please enter a valid pincode";
    if (!inst.contact) newErrors.institution_contact = "Contact is required";
    if (!inst.street) newErrors.institution_street = "Street is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- handle submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      console.log("Submitting form data:", formData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/institution-register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Registration failed:", data);
        alert("Registration failed. Check required fields.");
      } else {
        console.log("Institution registration successful:", data);
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UI ---
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
              Set up your institution account to manage student activities and
              certifications
            </p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                Institution Registration
              </CardTitle>
              <CardDescription>
                Provide your admin credentials and institution details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Admin Credentials */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Admin Credentials</h3>

                  <InputField
                    label="Username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    required
                    error={errors.username}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="First Name"
                      placeholder="Enter first name"
                      value={formData.first_name}
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                      required
                      error={errors.first_name}
                    />

                    <InputField
                      label="Last Name"
                      placeholder="Enter last name"
                      value={formData.last_name}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                      required
                      error={errors.last_name}
                    />
                  </div>

                  <InputField
                    label="Email"
                    type="email"
                    placeholder="admin.user@institution.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    error={errors.email}
                  />

                  <InputField
                    label="Password"
                    type="password"
                    placeholder="Create a strong password (min 8 characters)"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    error={errors.password}
                  />
                </div>

                {/* Institution Details */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-semibold text-lg">Institution Details</h3>

                  <InputField
                    label="Institution Name"
                    placeholder="e.g., New University of Technology"
                    value={formData.institution.name}
                    onChange={(e) =>
                      handleInstitutionChange("name", e.target.value)
                    }
                    required
                    error={errors.institution_name}
                  />

                  <InputField
                    label="Street"
                    placeholder="e.g., Main Road, Near Metro"
                    value={formData.institution.street}
                    onChange={(e) =>
                      handleInstitutionChange("street", e.target.value)
                    }
                    required
                    error={errors.institution_street}
                  />

                  <InputField
                    label="Country"
                    placeholder="e.g., India"
                    value={formData.institution.country}
                    onChange={(e) =>
                      handleInstitutionChange("country", e.target.value)
                    }
                    required
                    error={errors.institution_country}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="State"
                      placeholder="e.g., Telangana"
                      value={formData.institution.state}
                      onChange={(e) =>
                        handleInstitutionChange("state", e.target.value)
                      }
                      required
                      error={errors.institution_state}
                    />

                    <InputField
                      label="City"
                      placeholder="e.g., Hyderabad"
                      value={formData.institution.city}
                      onChange={(e) =>
                        handleInstitutionChange("city", e.target.value)
                      }
                      required
                      error={errors.institution_city}
                    />
                  </div>

                  <InputField
                    label="Pincode"
                    placeholder="e.g., 500001"
                    value={formData.institution.pincode}
                    onChange={(e) =>
                      handleInstitutionChange("pincode", e.target.value)
                    }
                    required
                    error={errors.institution_pincode}
                  />

                  <InputField
                    label="Contact"
                    placeholder="e.g., +91 9876543210"
                    value={formData.institution.contact}
                    onChange={(e) =>
                      handleInstitutionChange("contact", e.target.value)
                    }
                    required
                    error={errors.institution_contact}
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

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already registered?{" "}
                    <Link
                      href="/auth/login"
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
