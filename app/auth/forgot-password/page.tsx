"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authAPI } from "@/lib/api-client"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    try {
      setIsLoading(true)

      await authAPI.requestPasswordReset({ email })

      toast.success("Password reset email sent! Check your inbox.")

      // Store email for the reset page
      if (typeof window !== "undefined") {
        localStorage.setItem("resetEmail", email)
      }

      // Navigate to reset password page after a delay
      setTimeout(() => {
        router.push("/auth/reset-password")
      }, 2000)
    } catch (error: any) {
      console.error("Password reset error:", error)
      toast.error(error.message || "Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-medium text-[#4355B9]">Forget Password</h1>
          <p className="text-gray-600 text-sm">Enter Your Email into the text box</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-700"
              required
              disabled={isLoading}
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
                SENDING...
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
