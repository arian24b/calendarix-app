"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function SplashScreen() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Check if user has already seen onboarding
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding") === "true"
    const isAuthenticated = localStorage.getItem("token")

    // Set a timeout to fade out the splash screen
    const timer = setTimeout(() => {
      setShowSplash(false)

      // After splash fades out, redirect to appropriate screen
      setTimeout(() => {
        if (isAuthenticated) {
          router.push("/calendar")
        } else if (hasSeenOnboarding) {
          router.push("/auth/login")
        } else {
          router.push("/onboarding")
        }
      }, 500) // Wait for fade out animation to complete
    }, 2000) // Show splash for 2 seconds

    return () => clearTimeout(timer)
  }, [router])

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="flex flex-col items-center justify-center min-h-screen bg-indigo-600"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-16 h-16 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
              <path
                d="M9 16L11 18L15 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Calendarix</h1>
          <p className="text-indigo-200 mt-2">Your personal time assistant</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
