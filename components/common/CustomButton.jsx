"use client"

import { Button } from "@/components/ui/button"

export default function CustomButton({
  children,
  variant = "default",
  size = "default",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  return (
    <Button variant={variant} size={size} onClick={onClick} type={type} disabled={disabled} className={`${className}`}>
      {children}
    </Button>
  )
}
