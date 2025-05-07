"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ApiContextType {
  isLoading: boolean
  error: string | null
  clearError: () => void
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export function ApiProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Global fetch error handler
  useEffect(() => {
    const originalFetch = window.fetch

    window.fetch = async (input, init) => {
      try {
        const response = await originalFetch(input, init)

        // Handle 401 Unauthorized globally
        if (response.status === 401) {
          // Clone the response so we can read it and still return it
          const clonedResponse = response.clone()

          try {
            const data = await clonedResponse.json()
            if (data.detail === "Not authenticated" || data.detail === "Invalid token") {
              localStorage.removeItem("token")
              toast.error("Session expired. Please log in again.")
              // router.push("/auth/login")
            }
          } catch (e) {
            // If we can't parse the response, just continue
          }
        }

        return response
      } catch (error) {
        // Handle network errors
        setError("Network error. Please check your connection.")
        return Promise.reject(error)
      }
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [router])

  const clearError = () => setError(null)

  return <ApiContext.Provider value={{ isLoading, error, clearError }}>{children}</ApiContext.Provider>
}

export function useApi() {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider")
  }
  return context
}
