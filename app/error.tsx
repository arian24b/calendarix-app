"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Home } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log error safely
    console.error("Page error:", error)
  }, [error])

  const handleReset = () => {
    try {
      if (typeof reset === "function") {
        reset()
      } else {
        // Fallback: reload the page
        window.location.reload()
      }
    } catch (err) {
      console.error("Reset failed:", err)
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-400 via-purple-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <div className="text-2xl">⚠️</div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>

        <p className="text-white/80 mb-6">{error.message || "An unexpected error occurred. Please try again."}</p>

        {error.digest && <p className="text-xs text-white/60 mb-6">Error ID: {error.digest}</p>}

        <div className="flex flex-col gap-3">
          <Button onClick={handleReset} className="bg-white text-purple-600 hover:bg-white/90" size="lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button
            onClick={handleGoHome}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
