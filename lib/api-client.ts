// Base API client for making authenticated requests

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// Generic API client for making requests
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token")

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        localStorage.removeItem("token")
        window.location.href = "/auth/login"
        throw new Error("Session expired. Please log in again.")
      }

      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `API error: ${response.status}`)
    }

    // For 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    apiClient<T>(endpoint, { ...options, method: "GET" }),
    
  post: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    apiClient<T>(endpoint, { 
      ...options, 
      method: "POST", 
      body: data ? JSON.stringify(data) : undefined 
    }),
    
  put: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    apiClient<T>(endpoint, { 
      ...options, 
      method: "PUT", 
      body: data ? JSON.stringify(data) : undefined 
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) => 
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
}
