"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Link from "next/link"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotSubmitted, setForgotSubmitted] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/calendar")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      // Format data for the API
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)
      formData.append("grant_type", "password")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/OAuth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Login failed")
      }

      const data = await response.json()

      // Store the token
      localStorage.setItem("token", data.access_token)

      toast.success("Login successful")
      router.push("/calendar")
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!forgotEmail) {
      toast.error("Please enter your email")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/OAuth/reset-password/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Password reset request failed")
      }

      setForgotSubmitted(true)
      toast.success("Password reset link sent to your email")
    } catch (error: any) {
      toast.error(error.message || "Failed to request password reset")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    if (provider === "google") {
      window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/OAuth/google/login`
    } else if (provider === "github") {
      window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/OAuth/github/login`
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 py-20">
      <div className="flex flex-col items-center justify-center mb-8 mt-8">
        <div className="flex items-center justify-center mb-6 gap-1">
          <img src="/icons/icon.png" alt="Calendarix Logo" className="size-12 rounded-xl" />
          <h1 className="text-center justify-start text-gray-600 text-xl font-normal leading-relaxed">Calendarix</h1>
        </div>
        <p className="self-stretch text-center justify-start text-gray-500 text-base font-normal leading-normal">
          Take control of your life by organizing it and creating routines!
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-500 py-3 rounded-lg"
          onClick={() => handleSocialLogin("google")}
        >
          <svg className="size-5" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
            <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"></path><path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"></path><polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"></polygon><path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"></path><path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"></path>
          </svg>
          <span>Google</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center mb-4">
        <div className="border-t border-gray-300 grow"></div>
        <div className="mx-4 text-sm text-gray-500">Or</div>
        <div className="border-t border-gray-300 grow"></div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative">
          <Input
            type="email"
            placeholder="Email"
            className="border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border-gray-300 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>

        <div className="text-right">
          <button type="button" className="justify-start text-slate-500 text-xs font-normal leading-snug" onClick={() => setShowForgotPassword(true)}>
            Forgot Password?
          </button>
        </div>

        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white uppercase" disabled={isLoading}>
          {isLoading ? "LOGGING IN..." : "LOGIN"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm font-medium text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-indigo-600 text-sm font-medium">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Forgot Password Sheet */}
      <Sheet open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <SheetContent side="bottom" className="h-[50vh]">
          <SheetHeader>
            <SheetTitle>Forgot Password</SheetTitle>
          </SheetHeader>

          {!forgotSubmitted ? (
            <form onSubmit={handleForgotPassword} className="space-y-6 mt-6">
              <p className="text-sm text-gray-500">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <Input
                type="email"
                placeholder="Email"
                className="border-gray-300"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "SENDING..." : "SEND RESET LINK"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 mt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-800">Email Sent</h2>
              <p className="text-gray-600">We've sent a password reset link to your email. Please check your inbox.</p>
              <Button
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => {
                  setShowForgotPassword(false)
                  setForgotSubmitted(false)
                  setForgotEmail("")
                }}
              >
                Back to Login
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
