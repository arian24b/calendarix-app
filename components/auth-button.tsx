import type React from "react"

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  fullWidth?: boolean
}

export function AuthButton({
  variant = "primary",
  fullWidth = true,
  children,
  className = "",
  ...props
}: AuthButtonProps) {
  const baseClasses = "font-medium py-3 rounded-lg"
  const variantClasses = variant === "primary" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
  const widthClass = fullWidth ? "w-full" : ""

  return (
    <button className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
