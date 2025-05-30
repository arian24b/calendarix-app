import { clearOnboardingCompleted } from "@/lib/utils/onboarding"
import { authAPI, userAPI } from "../api-client"

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
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Use the API client which handles proxy and CORS
      const data = await authAPI.login(credentials.email, credentials.password)

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

      // Temporarily store the token for the API call if provided
      const originalToken = localStorage.getItem("token")
      if (token && token !== originalToken) {
        localStorage.setItem("token", token)
      }

      try {
        // Use the API client which handles proxy and CORS
        const userData = await userAPI.getCurrentUser()
        return {
          id: userData.id.toString(),
          username: userData.username,
          email: userData.email,
          avatar: undefined
        } as User
      } finally {
        // Restore the original token if we temporarily changed it
        if (token && token !== originalToken) {
          if (originalToken) {
            localStorage.setItem("token", originalToken)
          } else {
            localStorage.removeItem("token")
          }
        }
      }
    } catch (error) {
      console.error("Get current user error:", error)
      // Clear invalid token on auth errors
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      throw error
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      // Use the API client which handles proxy and CORS
      const data = await authAPI.register({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      })

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
      // Use the API client which handles proxy and CORS
      await authAPI.requestPasswordReset({ email })
    } catch (error) {
      console.error("Forgot password error:", error)
      throw error
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Use the API client which handles proxy and CORS
      await authAPI.confirmPasswordReset({
        token,
        new_password: newPassword
      })
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
