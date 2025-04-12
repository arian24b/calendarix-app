import type { Token, UserCreate, ApiError, HTTPValidationError } from "@/types/api"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.calendarix.pro"

/**
 * Base API client for making requests to the backend
 */
class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const headers = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    }

    const config = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        let errorMessage = `API Error: ${response.status}`

        try {
          const errorData = await response.json()

          // Handle validation errors
          if (response.status === 422 && "detail" in errorData) {
            const validationError = errorData as HTTPValidationError
            errorMessage = validationError.detail?.[0]?.msg || "Validation error"
          }

          // Handle API errors with detail field
          if ("detail" in errorData) {
            const apiError = errorData as ApiError
            errorMessage = apiError.detail
          }
        } catch (e) {
          // If we can't parse the error as JSON, just use the status code
          console.error("Error parsing API error response:", e)
        }

        throw new Error(errorMessage)
      }

      // For empty responses (like 204 No Content)
      if (response.status === 204) {
        return {} as T
      }

      try {
        return await response.json()
      } catch (e) {
        console.error("Error parsing API response:", e)
        return {} as T
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("An unknown error occurred")
    }
  }
}

/**
 * Authentication API client
 */
export class AuthApi extends ApiClient {
  async register(userData: UserCreate): Promise<Token> {
    return this.request<Token>("/v1/OAuth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(username: string, password: string): Promise<Token> {
    const formData = new URLSearchParams()
    formData.append("username", username)
    formData.append("password", password)

    return this.request<Token>("/v1/OAuth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/v1/OAuth/verify-email?token=${token}`)
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>("/v1/OAuth/reset-password/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>("/v1/OAuth/reset-password/", {
      method: "POST",
      body: JSON.stringify({ token, new_password: newPassword }),
    })
  }

  async googleLogin(): Promise<void> {
    window.location.href = `${this.baseUrl}/v1/OAuth/google/login`
  }

  async githubLogin(): Promise<void> {
    window.location.href = `${this.baseUrl}/v1/OAuth/github/login`
  }
}

/**
 * User API client
 */
export class UserApi extends ApiClient {
  async getCurrentUser() {
    return this.request("/v1/user/me")
  }

  async updateProfile(profileData: any) {
    return this.request("/v1/user/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  async deactivateAccount() {
    return this.request("/v1/user/deactivate", {
      method: "POST",
    })
  }
}

// Create and export API instances
export const authApi = new AuthApi()
export const userApi = new UserApi()
