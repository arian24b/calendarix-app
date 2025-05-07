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
    }, 5000) // Show splash for 2 seconds

    return () => clearTimeout(timer)
  }, [router])

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="flex flex-col items-center justify-center min-h-screen bg-indigo-600 relative"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundImage: "url('icons/ee701a3b27c3366c254af783cea70646a465e133.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >

          <div className="flex items-center justify-center mb-6 gap-1">
            <img src="/icons/icon.png" alt="Calendarix Logo" className="size-12 rounded-xl" />
            <h1 className="text-center justify-start text-white text-xl font-normal font-['Inter'] leading-relaxed">Calendarix</h1>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
