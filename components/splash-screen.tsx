"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)

      // Check if user has seen onboarding
      setTimeout(() => {
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
        const isAuthenticated = localStorage.getItem("token")

        if (!hasSeenOnboarding) {
          router.push("/onboarding")
        } else if (isAuthenticated) {
          router.push("/calendar")
        } else {
          router.push("/auth/login")
        }
      }, 500)
    }, 2500)

    return () => clearTimeout(timer)
  }, [router])

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-linear-to-br from-pink-400 via-purple-500 to-blue-600 opacity-0 transition-opacity duration-500 pointer-events-none" />
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-pink-400 via-purple-500 to-blue-600 animate-in fade-in duration-1000">
      <div className="flex flex-col items-center space-y-6 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
        {/* Calendarix Logo */}
        <div className="relative">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
            </div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 w-20 h-20 bg-white rounded-2xl opacity-20 blur-xl"></div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-light text-white tracking-wide">Calendarix</h1>

        {/* Loading indicator */}
        <div className="flex space-x-1 mt-8">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  )
}
