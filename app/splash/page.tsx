"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to onboarding after 2 seconds
    const timer = setTimeout(() => {
      router.push("/onboarding")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#414ba4] to-[#e779a5]">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl"></div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Calendarix</h1>
        <p className="text-white/80">Organize your life</p>
      </div>
    </div>
  )
}
