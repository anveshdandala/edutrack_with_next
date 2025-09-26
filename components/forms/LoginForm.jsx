"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import InputField from "@/components/common/InputField"
import CustomButton from "@/components/common/CustomButton"

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Simulate login logic
      console.log("Login attempt:", formData)

      // For demo purposes, redirect based on email domain
      if (formData.email.includes("student")) {
        router.push("/student")
      } else if (formData.email.includes("faculty")) {
        router.push("/faculty-dashboard")
      } else {
        router.push("/student") // Default to student dashboard
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        placeholder="Enter your password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        required
        error={errors.password}
      />

      <CustomButton type="submit" className="w-full" size="lg">
        Login
      </CustomButton>
    </form>
  )
}
