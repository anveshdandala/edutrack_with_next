"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import InputField from "@/components/common/InputField"
import CustomButton from "@/components/common/CustomButton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    role: "",
    institute: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Student specific
    rollNumber: "",
    department: "",
    yearOfStudy: "",
    // Faculty specific
    facultyId: "",
    designation: "",
  })
  const [errors, setErrors] = useState({})

  const institutes = [
    "Indian Institute of Technology (IIT)",
    "Indian Institute of Management (IIM)",
    "National Institute of Technology (NIT)",
    "Indian Institute of Science (IISc)",
    "Jawaharlal Nehru University (JNU)",
    "University of Delhi",
    "Other",
  ]

  const departments = [
    "Computer Science & Engineering",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Information Technology",
    "Business Administration",
    "Other",
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.role) newErrors.role = "Please select a role"
    if (!formData.institute) newErrors.institute = "Please select an institute"
    if (!formData.fullName) newErrors.fullName = "Full name is required"
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Role-specific validation
    if (formData.role === "student") {
      if (!formData.rollNumber) newErrors.rollNumber = "Roll number is required"
      if (!formData.department) newErrors.department = "Department is required"
      if (!formData.yearOfStudy) newErrors.yearOfStudy = "Year of study is required"
    } else if (formData.role === "faculty") {
      if (!formData.facultyId) newErrors.facultyId = "Faculty ID is required"
      if (!formData.department) newErrors.department = "Department is required"
      if (!formData.designation) newErrors.designation = "Designation is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      console.log("Signup attempt:", formData)

      // Redirect based on role
      if (formData.role === "student") {
        router.push("/student")
      } else {
        router.push("/faculty-dashboard")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Role <span className="text-red-500">*</span>
        </Label>
        <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
          <SelectTrigger className={errors.role ? "border-red-500" : ""}>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="faculty">Faculty</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
      </div>

      {/* Institute Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Institute <span className="text-red-500">*</span>
        </Label>
        <Select value={formData.institute} onValueChange={(value) => handleInputChange("institute", value)}>
          <SelectTrigger className={errors.institute ? "border-red-500" : ""}>
            <SelectValue placeholder="Select your institute" />
          </SelectTrigger>
          <SelectContent>
            {institutes.map((institute) => (
              <SelectItem key={institute} value={institute}>
                {institute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.institute && <p className="text-sm text-red-500">{errors.institute}</p>}
      </div>

      {/* Common Fields */}
      <InputField
        label="Full Name"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={(e) => handleInputChange("fullName", e.target.value)}
        required
        error={errors.fullName}
      />

      <InputField
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        required
        error={errors.email}
      />

      <InputField
        label="Password"
        type="password"
        placeholder="Create a password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        required
        error={errors.password}
      />

      <InputField
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
        required
        error={errors.confirmPassword}
      />

      {/* Role-specific Fields */}
      {formData.role === "student" && (
        <>
          <InputField
            label="Roll Number"
            placeholder="Enter your roll number"
            value={formData.rollNumber}
            onChange={(e) => handleInputChange("rollNumber", e.target.value)}
            required
            error={errors.rollNumber}
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Department <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
              <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Year of Study <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.yearOfStudy} onValueChange={(value) => handleInputChange("yearOfStudy", value)}>
              <SelectTrigger className={errors.yearOfStudy ? "border-red-500" : ""}>
                <SelectValue placeholder="Select year of study" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st Year">1st Year</SelectItem>
                <SelectItem value="2nd Year">2nd Year</SelectItem>
                <SelectItem value="3rd Year">3rd Year</SelectItem>
                <SelectItem value="4th Year">4th Year</SelectItem>
                <SelectItem value="5th Year">5th Year</SelectItem>
                <SelectItem value="Postgraduate">Postgraduate</SelectItem>
              </SelectContent>
            </Select>
            {errors.yearOfStudy && <p className="text-sm text-red-500">{errors.yearOfStudy}</p>}
          </div>
        </>
      )}

      {formData.role === "faculty" && (
        <>
          <InputField
            label="Faculty ID"
            placeholder="Enter your faculty ID"
            value={formData.facultyId}
            onChange={(e) => handleInputChange("facultyId", e.target.value)}
            required
            error={errors.facultyId}
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Department <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
              <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
          </div>

          <InputField
            label="Designation"
            placeholder="e.g., Assistant Professor, Associate Professor"
            value={formData.designation}
            onChange={(e) => handleInputChange("designation", e.target.value)}
            required
            error={errors.designation}
          />
        </>
      )}

      <CustomButton type="submit" className="w-full" size="lg">
        Create Account
      </CustomButton>
    </form>
  )
}
