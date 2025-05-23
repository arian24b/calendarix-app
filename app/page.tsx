"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function HomePage() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
      // Check if user is authenticated
      const token = localStorage.getItem("token")
      if (token) {
        router.push("/categories")
      } else {
        router.push("/auth/register")
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-[#4355B9] z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-6">
            <div className="grid grid-cols-2 gap-2">
              <div className="w-4 h-4 bg-[#4355B9] rounded"></div>
              <div className="w-4 h-4 bg-[#4355B9] rounded"></div>
              <div className="w-4 h-4 bg-[#4355B9] rounded"></div>
              <div className="w-4 h-4 bg-[#4355B9] rounded"></div>
            </div>
          </div>
          <h1 className="text-3xl font-medium text-white mb-2">Calendarix</h1>
          <p className="text-blue-100 text-center px-8">
            Take control of your life by organizing it and creating routines!
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
