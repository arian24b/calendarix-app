"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { register } from "@/lib/services/auth-service"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    if (!agreeToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    try {
      setIsLoading(true)

      const response = await register({
        username: name,
        email: email,
        password: password,
      })

      // Store token and redirect
      localStorage.setItem("token", response.access_token)

      // Store user info for preview mode
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          username: name,
          email: email,
          created_at: new Date().toISOString(),
        }),
      )

      toast.success("Account created successfully!")

      // Small delay to show the success message
      setTimeout(() => {
        router.push("/categories")
      }, 1000)
    } catch (error: any) {
      console.error("Registration error:", error)
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#4355B9] rounded-2xl flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-medium text-gray-800">Calendarix</h1>
          <p className="text-gray-600 text-center leading-relaxed">
            Take control of your life by organizing it and creating routines!
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-12 bg-[#E8F0FE] border-[#E8F0FE] hover:bg-[#D2E3FC]"
            onClick={() => handleSocialLogin("Facebook")}
          >
            <div className="w-6 h-6 bg-[#1877F2] rounded mr-3 flex items-center justify-center">
              <span className="text-white text-sm font-bold">f</span>
            </div>
            <span className="text-gray-700">Facebook</span>
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 bg-[#E8F0FE] border-[#E8F0FE] hover:bg-[#D2E3FC]"
            onClick={() => handleSocialLogin("Google")}
          >
            <div className="w-6 h-6 mr-3 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <span className="text-gray-700">Google</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-50 px-4 text-gray-500">Or</span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-white border-gray-200 placeholder:text-gray-400"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-white border-gray-200 placeholder:text-gray-400"
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-white border-gray-200 placeholder:text-gray-400 pr-12"
              required
              disabled={isLoading}
              minLength={6}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={setAgreeToTerms}
              className="mt-1 border-gray-300"
              disabled={isLoading}
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-[#4355B9] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#4355B9] hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Create Account Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#4355B9] hover:bg-[#3A4A9F] text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                CREATING ACCOUNT...
              </div>
            ) : (
              "CREATE ACCOUNT"
            )}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link href="/auth/login" className="text-[#4355B9] hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
