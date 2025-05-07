"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  username: string
  email: string
  phone?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user")
      }

      const userData = await response.json()
      setUser(userData)
      return userData
    } catch (error) {
      console.error("Error fetching user:", error)
      localStorage.removeItem("token")
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      // Set cookie for server-side authentication
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
      fetchUser(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = (token: string) => {
    localStorage.setItem("token", token)
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
    fetchUser(token)
  }

  const logout = () => {
    localStorage.removeItem("token")
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    setUser(null)
    // router.push("/auth/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
