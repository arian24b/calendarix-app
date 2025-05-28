"use client"

import { useEffect } from "react"

export default function PrivacyPolicyPage() {
  useEffect(() => {
    // Redirect to external privacy policy
    window.location.href = "https://calendarix.pro/policy/"
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Privacy Policy...</p>
      </div>
    </div>
  )
}
