"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordToggle?: boolean
}

export function AuthInput({ showPasswordToggle, ...props }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const type = showPasswordToggle ? (showPassword ? "text" : "password") : props.type

  return (
    <div className="relative">
      <input
        {...props}
        type={type}
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {showPasswordToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  )
}
