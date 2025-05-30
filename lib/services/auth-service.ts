import { clearOnboardingCompleted } from "@/lib/utils/onboarding"
import { env } from "@/lib/config"

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  username: string
  email: string
  password: string
}

interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

interface AuthResponse {
  token: string
  user: User
}

class AuthService {
  private baseUrl = env.NEXT_PUBLIC_API_URL

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // OpenAPI expects form-encoded data for OAuth login
      const formData = new URLSearchParams()
      formData.append("username", credentials.email)
      formData.append("password", credentials.password)
      formData.append("grant_type", "password")

      const response = await fetch(`${this.baseUrl}/v1/OAuth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Login failed")
      }

      const data = await response.json()

      // Store token from OAuth response
      localStorage.setItem("token", data.access_token)

      // Set cookie for middleware access
      if (typeof document !== "undefined") {
        document.cookie = `token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
      }

      // Fetch user data after successful login
      const userData = await this.getCurrentUser(data.access_token)
      localStorage.setItem("user", JSON.stringify(userData))

      return {
        token: data.access_token,
        user: userData
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  async getCurrentUser(token?: string): Promise<User> {
    try {
      const authToken = token || localStorage.getItem("token")
      if (!authToken) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${this.baseUrl}/v1/user/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid token
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          throw new Error("Session expired")
        }
        throw new Error("Failed to fetch user data")
      }

      return await response.json()
    } catch (error) {
      console.error("Get current user error:", error)
      throw error
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/OAuth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Registration failed")
      }

      const data = await response.json()

      // Store token from OAuth response
      localStorage.setItem("token", data.access_token)

      // Set cookie for middleware access
      if (typeof document !== "undefined") {
        document.cookie = `token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
      }

      // Fetch user data after successful registration
      const userData = await this.getCurrentUser(data.access_token)
      localStorage.setItem("user", JSON.stringify(userData))

      return {
        token: data.access_token,
        user: userData
      }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear local storage
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Clear onboarding status using utility
      clearOnboardingCompleted()

      // Clear cookies if they exist
      if (typeof document !== "undefined") {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/OAuth/reset-password/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to send reset email")
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      throw error
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/OAuth/reset-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: newPassword
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to reset password")
      }
    } catch (error) {
      console.error("Reset password error:", error)
      throw error
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("token")
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
  }

  getUser(): User | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }
}

export type { LoginCredentials, RegisterCredentials, User, AuthResponse }

export const authService = new AuthService()

// Export individual methods for convenience
export const login = (credentials: LoginCredentials) => authService.login(credentials)
export const register = (credentials: RegisterCredentials) => authService.register(credentials)
export const logout = () => authService.logout()
export const forgotPassword = (email: string) => authService.forgotPassword(email)
export const resetPassword = (token: string, newPassword: string) => authService.resetPassword(token, newPassword)
