import type { Token, UserCreate, ProfileUpdate, PasswordResetRequest, PasswordResetConfirm } from "@/types/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `API error: ${response.status}`)
  }
  return response.json() as Promise<T>
}

// Authentication functions
export async function loginUser(credentials: { username: string; password: string }): Promise<Token> {
  const formData = new URLSearchParams()
  formData.append("username", credentials.username)
  formData.append("password", credentials.password)
  formData.append("grant_type", "password")

  const response = await fetch(`${API_BASE_URL}/v1/OAuth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  })

  return handleResponse<Token>(response)
}

export async function registerUser(userData: UserCreate): Promise<Token> {
  const response = await fetch(`${API_BASE_URL}/v1/OAuth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  return handleResponse<Token>(response)
}

export async function requestPasswordReset(data: PasswordResetRequest): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/v1/OAuth/reset-password/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return handleResponse<{ message: string }>(response)
}

export async function resetPassword(data: PasswordResetConfirm): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/v1/OAuth/reset-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return handleResponse<{ message: string }>(response)
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/v1/OAuth/verify-email?token=${token}`, {
    method: "GET",
  })

  return handleResponse<{ message: string }>(response)
}

// User management functions
export async function getCurrentUser() {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No authentication token found")

  const response = await fetch(`${API_BASE_URL}/v1/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse(response)
}

export async function updateProfile(profileData: ProfileUpdate) {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No authentication token found")

  const response = await fetch(`${API_BASE_URL}/v1/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  })

  return handleResponse(response)
}

export async function deactivateAccount(): Promise<{ message: string }> {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No authentication token found")

  const response = await fetch(`${API_BASE_URL}/v1/user/deactivate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse<{ message: string }>(response)
}

export async function generateApiKey(): Promise<{ api_key: string }> {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No authentication token found")

  const response = await fetch(`${API_BASE_URL}/v1/user/generate-api-key`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse<{ api_key: string }>(response)
}

// OAuth functions
export function initiateGoogleLogin() {
  window.location.href = `${API_BASE_URL}/v1/OAuth/google/login`
}

export function initiateGithubLogin() {
  window.location.href = `${API_BASE_URL}/v1/OAuth/github/login`
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token")
}

// Helper function to get auth header
export function getAuthHeader(): { Authorization: string } | {} {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}
