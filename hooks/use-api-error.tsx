"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import { APIRequestError } from "@/lib/api-client"

export function useApiError() {
  const handleError = useCallback((error: unknown, defaultMessage = "An error occurred") => {
    console.error("API Error:", error)

    if (error instanceof APIRequestError) {
      // Handle specific error types
      switch (error.status) {
        case 401:
          toast.error("Authentication required. Please log in again.")
          // Redirect to login if needed
          if (typeof window !== "undefined") {
            localStorage.removeItem("token")
            window.location.href = "/auth/login"
          }
          break
        case 403:
          toast.error("Access denied. You don't have permission to perform this action.")
          break
        case 404:
          toast.error("Resource not found.")
          break
        case 422:
          toast.error(`Validation error: ${error.detail}`)
          break
        case 400:
          toast.error(error.detail || "Bad request")
          break
        case 500:
          toast.error("Server error. Please try again later.")
          break
        case 408:
          toast.error("Request timed out. Please check your connection.")
          break
        default:
          toast.error(error.detail || defaultMessage)
      }
    } else if (error instanceof Error) {
      toast.error(error.message || defaultMessage)
    } else {
      toast.error(defaultMessage)
    }
  }, [])

  return { handleError }
}
