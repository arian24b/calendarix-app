"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot" | "newPassword">("signup")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission based on authMode
    if (authMode === "signup") {
      console.log("Sign up with:", { name, email, password, agreeToTerms })
    } else if (authMode === "login") {
      console.log("Login with:", { email, password })
    } else if (authMode === "forgot") {
      console.log("Reset password for:", { email })
      // Move to new password screen after email verification (in a real app)
      setAuthMode("newPassword")
    } else if (authMode === "newPassword") {
      console.log("Set new password:", { password, confirmPassword })
      // Redirect to login after password reset
      setAuthMode("login")
    }
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto">
        {/* Logo and Header */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#f0f2ff] rounded-lg flex items-center justify-center mr-2">
              <div className="w-5 h-5 bg-primary rounded-md"></div>
            </div>
            <span className="text-xl font-semibold text-[#262626]">Tellmi</span>
          </div>
        </div>

        <p className="text-center text-[#48546d] mb-6">
          Take control of your life by organizing it and creating routines!
        </p>

        {authMode === "forgot" ? (
          <ForgotPasswordForm
            email={email}
            setEmail={setEmail}
            onSubmit={handleSubmit}
            onBack={() => setAuthMode("login")}
          />
        ) : authMode === "newPassword" ? (
          <NewPasswordForm
            password={password}
            confirmPassword={confirmPassword}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            onSubmit={handleSubmit}
          />
        ) : (
          <>
            {/* Social Login Buttons */}
            <div className="flex gap-4 mb-4">
              <button className="flex-1 bg-[#f1f5f9] text-[#48546d] py-2 px-4 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#1877f2"
                  className="mr-2"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
              <button className="flex-1 bg-[#f1f5f9] text-[#48546d] py-2 px-4 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="mr-2">
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
                Google
              </button>
            </div>

            <div className="text-center text-[#8291ae] my-4">Or</div>

            <form onSubmit={handleSubmit}>
              {authMode === "signup" && (
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8291ae]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {authMode === "login" && (
                <div className="flex justify-end mb-4">
                  <button type="button" className="text-sm text-[#8291ae]" onClick={() => setAuthMode("forgot")}>
                    Forgot Password?
                  </button>
                </div>
              )}

              {authMode === "signup" && (
                <div className="mb-4 flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 mr-2"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-[#48546d]">
                    I'm agree to the{" "}
                    <Link href="/terms" className="text-primary">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              )}

              <button type="submit" className="w-full bg-primary text-white font-medium py-3 rounded-lg mb-4">
                {authMode === "signup" ? "CREATE ACCOUNT" : "LOGIN"}
              </button>
            </form>
          </>
        )}

        {/* Toggle between login and signup */}
        {authMode !== "forgot" && authMode !== "newPassword" && (
          <p className="text-center text-[#48546d] text-sm">
            {authMode === "login" ? "Do you have account? " : "Do you have account? "}
            <button onClick={toggleAuthMode} className="text-primary font-medium">
              {authMode === "login" ? "Sign In" : "Sign In"}
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

interface ForgotPasswordFormProps {
  email: string
  setEmail: (email: string) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}

function ForgotPasswordForm({ email, setEmail, onSubmit, onBack }: ForgotPasswordFormProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-center text-[#262626] mb-2">Forget Password</h2>
      <p className="text-center text-[#8291ae] mb-6">Enter Your Email into the text box</p>

      <form onSubmit={onSubmit}>
        <div className="mb-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full bg-primary text-white font-medium py-3 rounded-lg mb-4">
          CONTINUE
        </button>
      </form>
    </div>
  )
}

interface NewPasswordFormProps {
  password: string
  confirmPassword: string
  setPassword: (password: string) => void
  setConfirmPassword: (password: string) => void
  showPassword: boolean
  showConfirmPassword: boolean
  setShowPassword: (show: boolean) => void
  setShowConfirmPassword: (show: boolean) => void
  onSubmit: (e: React.FormEvent) => void
}

function NewPasswordForm({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  onSubmit,
}: NewPasswordFormProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-center text-[#262626] mb-2">New Password</h2>
      <p className="text-center text-[#8291ae] mb-6">
        Please use a password with a combination of uppercase and lowercase letters, symbols, and at least 8 characters.
      </p>

      <form onSubmit={onSubmit}>
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8291ae]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="mb-6 relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repeat"
            className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8291ae]"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type="submit" className="w-full bg-primary text-white font-medium py-3 rounded-lg mb-4">
          CONTINUE
        </button>
      </form>
    </div>
  )
}

