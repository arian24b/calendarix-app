"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export default function RegisterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("register")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNameInput, setShowNameInput] = useState(false)
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [showPasswordInput, setShowPasswordInput] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/calendar")
    }
  }, [router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/OAuth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Registration failed")
      }

      const data = await response.json()

      // Store the token
      localStorage.setItem("token", data.access_token)

      toast.success("Registration successful")
      router.push("/calendar")
    } catch (error: any) {
      toast.error(error.message || "Registration failed")
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

  const openNameInput = () => {
    setShowNameInput(true)
  }

  const openEmailInput = () => {
    setShowEmailInput(true)
  }

  const openPasswordInput = () => {
    setShowPasswordInput(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col items-center justify-center mb-8 mt-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
          <svg className="w-10 h-10 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-indigo-600">Calendarix</h1>
        <p className="text-sm text-gray-500 text-center mt-2">
          Take control of your life by organizing it and creating routines!
        </p>
      </div>

      <Tabs defaultValue="register" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login" onClick={() => router.push("/auth/login")}>
            Login
          </TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-4 mb-4">
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 py-3 rounded-lg"
          onClick={() => handleSocialLogin("facebook")}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
          </svg>
          <span>Facebook</span>
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-500 py-3 rounded-lg"
          onClick={() => handleSocialLogin("google")}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm6.804 16.864c-.243.668-.687 1.193-1.299 1.572-.612.378-1.296.571-2.052.571-.707 0-1.333-.159-1.88-.476-.546-.317-.97-.772-1.27-1.366-.3-.593-.45-1.294-.45-2.101 0-.804.15-1.507.45-2.104.3-.597.724-1.056 1.27-1.373.546-.317 1.173-.476 1.88-.476.755 0 1.439.194 2.05.583.611.389 1.055.92 1.3 1.567l-1.609.673c-.146-.359-.383-.636-.712-.828-.33-.192-.727-.288-1.19-.288-.435 0-.82.101-1.156.305-.336.203-.596.488-.78.853-.183.365-.275.784-.275 1.258 0 .473.092.89.275 1.253.184.363.444.645.78.847.336.201.721.302 1.156.302.464 0 .86-.096 1.19-.288.33-.192.566-.472.712-.84l1.61.673zm-7.804-4.864v1h-2v1h2v1h-2v1h2v1h-3v-5h3zm-4-3h-1v5h-1v-5h-1v-1h3v1z" />
          </svg>
          <span>Google</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center mb-4">
        <div className="border-t border-gray-300 flex-grow"></div>
        <div className="mx-4 text-sm text-gray-500">Or</div>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Button
            type="button"
            className="w-full justify-between border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={openNameInput}
          >
            {name ? name : "Name"}
            <span className="text-gray-400">→</span>
          </Button>
        </div>

        <div>
          <Button
            type="button"
            className="w-full justify-between border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={openEmailInput}
          >
            {email ? email : "Email"}
            <span className="text-gray-400">→</span>
          </Button>
        </div>

        <div>
          <Button
            type="button"
            className="w-full justify-between border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={openPasswordInput}
          >
            {password ? "••••••••" : "Password"}
            <span className="text-gray-400">→</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{" "}
            <Link href="/terms" className="text-indigo-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-indigo-600">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={isLoading || !agreeToTerms}
        >
          {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-600 font-medium">
            Sign In
          </Link>
        </p>
      </div>

      {/* Name Input Sheet */}
      <Sheet open={showNameInput} onOpenChange={setShowNameInput}>
        <SheetContent side="bottom" className="h-[30vh]">
          <SheetHeader>
            <SheetTitle>Enter Your Name</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <Input
              type="text"
              placeholder="Full Name"
              className="border-gray-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setShowNameInput(false)}
            >
              Save
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Email Input Sheet */}
      <Sheet open={showEmailInput} onOpenChange={setShowEmailInput}>
        <SheetContent side="bottom" className="h-[30vh]">
          <SheetHeader>
            <SheetTitle>Enter Your Email</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <Input
              type="email"
              placeholder="Email Address"
              className="border-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setShowEmailInput(false)}
            >
              Save
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Password Input Sheet */}
      <Sheet open={showPasswordInput} onOpenChange={setShowPasswordInput}>
        <SheetContent side="bottom" className="h-[30vh]">
          <SheetHeader>
            <SheetTitle>Create Password</SheetTitle>
          </SheetHeader>
          <div className="py-6">
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
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <Button
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setShowPasswordInput(false)}
            >
              Save
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
