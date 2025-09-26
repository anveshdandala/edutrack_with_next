"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InputField({ label, type = "text", placeholder, value, onChange, required = false, error }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={label.toLowerCase().replace(/\s+/g, "-")}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full ${error ? "border-red-500" : ""}`}
        required={required}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
