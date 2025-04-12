"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "newpassword">("signin")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    agreeToTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // For demo purposes, just redirect to dashboard
    if (mode === "signin" || mode === "signup") {
      // Use router.replace instead of push to avoid adding to history stack
      router.replace("/dashboard")
    } else if (mode === "forgot") {
      setMode("newpassword")
    } else if (mode === "newpassword") {
      setMode("signin")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-md"></div>
            </div>

            <div className="text-center mt-4 mb-2">
              <h1 className="text-xl font-semibold text-primary">Calendarix</h1>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">Take control of your life by organizing it and creating routines!</p>
            </div>
          </div>

          {mode === "signin" && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="mb-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="text-right mb-4">
                <button type="button" onClick={() => setMode("forgot")} className="text-xs text-gray-500">
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="w-full bg-primary text-white font-medium py-3 rounded-lg">
                LOGIN
              </button>

              <div className="text-center text-sm mt-4">
                <span className="text-gray-500">Don't have an account? </span>
                <button type="button" onClick={() => setMode("signup")} className="text-primary font-medium">
                  Sign Up
                </button>
              </div>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="mb-4 flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-xs text-gray-500">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <button type="submit" className="w-full bg-primary text-white font-medium py-3 rounded-lg">
                CREATE ACCOUNT
              </button>

              <div className="text-center text-sm mt-4">
                <span className="text-gray-500">Already have an account? </span>
                <button type="button" onClick={() => setMode("signin")} className="text-primary font-medium">
                  Sign In
                </button>
              </div>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-center mb-2">Forgot Password</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Enter your email address below</p>

              <div className="mb-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-primary text-white font-medium py-3 rounded-lg">
                CONTINUE
              </button>
            </form>
          )}

          {mode === "newpassword" && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-center mb-2">New Password</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Please create a new password</p>

              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  placeholder="New Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  name="repeatPassword"
                  placeholder="Repeat Password"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-primary text-white font-medium py-3 rounded-lg">
                CONTINUE
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
