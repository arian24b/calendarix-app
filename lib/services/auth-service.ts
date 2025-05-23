import { apiRequest } from "../api-client"

interface UserCreate {
  username: string
  email: string
  password: string
  phone?: string
}

interface LoginCredentials {
  username: string
  password: string
}

interface Token {
  access_token: string
  token_type: string
}

interface PasswordResetRequest {
  email: string
}

interface PasswordResetConfirm {
  token: string
  new_password: string
}

interface MessageResponse {
  message: string
}

// Check if we're in a preview/demo environment
function isPreviewEnvironment(): boolean {
  return (
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL.includes("localhost") ||
    (typeof window !== "undefined" && window.location.hostname.includes("v0.dev"))
  )
}

export async function register(userData: UserCreate): Promise<Token> {
  // For preview environment, return mock data immediately
  if (isPreviewEnvironment()) {
    console.log("Using mock registration for preview environment")
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      access_token: "mock_token_register_" + Date.now(),
      token_type: "bearer",
    }
  }

  return apiRequest<Token>({
    method: "POST",
    path: "/v1/OAuth/register",
    body: userData,
  })
}

export async function login(credentials: LoginCredentials): Promise<Token> {
  // For preview environment, return mock data immediately
  if (isPreviewEnvironment()) {
    console.log("Using mock login for preview environment")
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      access_token: "mock_token_login_" + Date.now(),
      token_type: "bearer",
    }
  }

  // Convert to form data format for login endpoint
  const formData = new URLSearchParams()
  formData.append("username", credentials.username)
  formData.append("password", credentials.password)
  formData.append("grant_type", "password")

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/OAuth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || "Login failed")
  }

  return response.json()
}

export async function requestPasswordReset(email: PasswordResetRequest): Promise<MessageResponse> {
  if (isPreviewEnvironment()) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { message: "Password reset email sent (mock)" }
  }

  return apiRequest<MessageResponse>({
    method: "POST",
    path: "/v1/OAuth/reset-password/request",
    body: email,
  })
}

export async function resetPassword(data: PasswordResetConfirm): Promise<MessageResponse> {
  if (isPreviewEnvironment()) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { message: "Password reset successful (mock)" }
  }

  return apiRequest<MessageResponse>({
    method: "POST",
    path: "/v1/OAuth/reset-password/",
    body: data,
  })
}

export async function verifyEmail(token: string): Promise<MessageResponse> {
  if (isPreviewEnvironment()) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { message: "Email verified successfully (mock)" }
  }

  return apiRequest<MessageResponse>({
    method: "GET",
    path: "/v1/OAuth/verify-email",
    params: { token },
  })
}
