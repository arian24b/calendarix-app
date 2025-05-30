"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Sparkles } from "lucide-react"
import { authService } from "@/lib/services/auth-service"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function AuthPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Check if we should start in register mode (from URL param or default to login)
    const [isRegisterMode, setIsRegisterMode] = useState(
        searchParams.get('mode') === 'register' || searchParams.get('register') === 'true'
    )

    // Form states
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode)
        // Clear form when switching modes
        setName("")
        setEmail("")
        setPassword("")
        setAgreeToTerms(false)
        setShowPassword(false)
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error("Please fill in all fields")
            return
        }

        try {
            setIsLoading(true)
            console.log("Attempting login with:", { email })

            const response = await authService.login({
                email: email,
                password: password,
            })

            console.log("Login response:", response)

            // Mark onboarding as completed for returning users
            localStorage.setItem("hasCompletedOnboarding", "true")

            toast.success("Login successful!")
            setTimeout(() => {
                router.push("/categories")
            }, 1000)
        } catch (error: unknown) {
            console.error("Login error:", error)
            toast.error((error as Error).message || "Login failed. Please check your credentials.")
        } finally {
            setIsLoading(false)
        }
    }

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

            const response = await authService.register({
                username: name,
                email: email,
                password: password,
            })

            if (typeof window !== "undefined") {
                localStorage.setItem("token", response.token)
                localStorage.setItem("user", JSON.stringify(response.user))
            }

            toast.success("Registration successful!")
            setTimeout(() => {
                router.push("/onboarding")
            }, 1000)
        } catch (error: unknown) {
            console.error("Registration error:", error)
            toast.error((error as Error).message || "Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = isRegisterMode ? handleRegister : handleLogin

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="flex items-center justify-center min-h-screen p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="flex items-center justify-center mb-4"
                            >
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                                    <Sparkles className="h-8 w-8 text-white" />
                                </div>
                            </motion.div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {isRegisterMode ? "Create Account" : "Welcome Back"}
                            </h1>
                            <p className="text-gray-600">
                                {isRegisterMode
                                    ? "Start your journey with Calendarix"
                                    : "Sign in to your Calendarix account"
                                }
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name field - only for register */}
                            {isRegisterMode && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-12 text-base"
                                        required={isRegisterMode}
                                    />
                                </motion.div>
                            )}

                            {/* Email field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 text-base"
                                    required
                                />
                            </div>

                            {/* Password field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={isRegisterMode ? "Create a password" : "Enter your password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 text-base pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {isRegisterMode && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Password must be at least 6 characters long
                                    </p>
                                )}
                            </div>

                            {/* Terms checkbox - only for register */}
                            {isRegisterMode && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="flex items-start space-x-3"
                                >
                                    <Checkbox
                                        id="terms"
                                        checked={agreeToTerms}
                                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                                        className="mt-1"
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                                        I agree to the{" "}
                                        <Link href="/legal/terms" className="text-blue-600 hover:underline">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/legal/privacy" className="text-blue-600 hover:underline">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </motion.div>
                            )}

                            {/* Forgot password link - only for login */}
                            {!isRegisterMode && (
                                <div className="flex justify-end">
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                            )}

                            {/* Submit button */}
                            <Button
                                type="submit"
                                disabled={isLoading || (isRegisterMode && !agreeToTerms)}
                                className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>{isRegisterMode ? "Creating Account..." : "Signing In..."}</span>
                                    </div>
                                ) : (
                                    <span>{isRegisterMode ? "Create Account" : "Sign In"}</span>
                                )}
                            </Button>
                        </form>

                        {/* Toggle between login/register */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                {isRegisterMode ? "Already have an account?" : "Don't have an account?"}{" "}
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    {isRegisterMode ? "Sign In" : "Create Account"}
                                </button>
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <div className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 text-base border-gray-200 hover:bg-gray-50"
                                disabled={isLoading}
                            >
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
