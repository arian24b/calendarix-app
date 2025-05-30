"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authAPI } from "@/lib/api-client"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [newPassword, setNewPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState("")

  useEffect(() => {
    // Get token from URL params or localStorage
    const urlToken = searchParams.get("token")
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("resetToken") : null

    if (urlToken) {
      setToken(urlToken)
    } else if (storedToken) {
      setToken(storedToken)
    }
  }, [searchParams])

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasMinLength = password.length >= 8

    return hasUpperCase && hasLowerCase && hasSymbols && hasMinLength
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPassword || !repeatPassword) {
      toast.error("Please fill in all fields")
      return
    }

    if (newPassword !== repeatPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (!validatePassword(newPassword)) {
      toast.error("Password must contain uppercase, lowercase letters, symbols, and be at least 8 characters")
      return
    }

    if (!token) {
      toast.error("Invalid reset token. Please request a new password reset.")
      return
    }

    try {
      setIsLoading(true)

      await authAPI.confirmPasswordReset({
        token,
        new_password: newPassword,
      })

      toast.success("Password reset successfully! You can now login with your new password.")

      // Clear stored data
      if (typeof window !== "undefined") {
        localStorage.removeItem("resetToken")
        localStorage.removeItem("resetEmail")
      }

      // Navigate to login page
      setTimeout(() => {
        router.push("/auth")
      }, 2000)
    } catch (error: any) {
      console.error("Password reset error:", error)
      toast.error(error.message || "Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-medium text-[#4355B9]">New Password</h1>
          <p className="text-gray-600 text-sm leading-relaxed px-4">
            Please use a password with a combination of uppercase and lowercase letters, symbols, and at least 8
            characters.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-700"
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Repeat"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="h-12 bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-700"
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#4355B9] hover:bg-[#3A4A9F] text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                UPDATING...
              </div>
            ) : (
              "CONTINUE"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
