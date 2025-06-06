import type {
  UserCreate,
  Token,
  MessageResponse,
  TwoFactorSetupResponse,
  TwoFactorVerify,
  PasswordResetRequest,
  PasswordResetConfirm,
  ProfileUpdate,
  TaskCreate,
  TaskOut,
  TaskUpdate,
  TaskDelete,
  HabitCreate,
  HabitOut,
  HabitUpdate,
  HabitDelete,
  CalendarCreate,
  CalendarOut,
  CalendarEvent,
  EventCreate,
  EventOut,
  NotificationCreate,
  NotificationRead,
  StringIDResponse,
  HTTPValidationError,
  ApiKeyResponse,
} from "./types/api"
import { env } from "./config"

// Use proxy for API requests to handle CORS
const API_BASE_URL = typeof window !== "undefined" && window.location.hostname !== "localhost" 
  ? "/api/proxy" // Use proxy in production
  : env.NEXT_PUBLIC_API_URL // Direct to backend in development

interface ApiRequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  body?: unknown
  params?: Record<string, string | number | boolean>
  requiresAuth?: boolean
  contentType?: "application/json" | "application/x-www-form-urlencoded"
}

// Custom error class for API errors
export class APIRequestError extends Error {
  public status: number
  public detail: string

  constructor(message: string, status: number, detail: string) {
    super(message)
    this.name = "APIRequestError"
    this.status = status
    this.detail = detail
  }
}

// Check if we're in a preview/demo environment
function isPreviewEnvironment(): boolean {
  return (
    typeof window !== "undefined" &&
    (window.location.hostname.includes("v0.dev") ||
      window.location.hostname === "localhost" ||
      !env.NEXT_PUBLIC_API_URL)
  )
}

// Mock responses for preview environment
async function getMockResponse<T>(method: string, path: string, body: unknown): Promise<T> {
  console.warn(`Using mock data for ${method} ${path}`)
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Auth endpoints
  if (path === "/v1/OAuth/register" && method === "POST") {
    return {
      access_token: "mock_token_register_" + Date.now(),
      token_type: "bearer",
    } as unknown as T
  }

  if (path === "/v1/OAuth/login" && method === "POST") {
    return {
      access_token: "mock_token_login_" + Date.now(),
      token_type: "bearer",
    } as unknown as T
  }

  if (path === "/v1/OAuth/reset-password/request" && method === "POST") {
    return {
      message: "Password reset email sent successfully",
    } as unknown as T
  }

  if (path === "/v1/OAuth/reset-password/" && method === "POST") {
    return {
      message: "Password reset successfully",
    } as unknown as T
  }

  // User endpoints
  if (path === "/v1/user/me" && method === "GET") {
    return {
      id: 1,
      username: "Demo User",
      email: "demo@example.com",
      is_active: true,
      is_admin: false,
      created_at: new Date().toISOString(),
    } as unknown as T
  }

  // Task endpoints
  if (path === "/v1/tasks/" && method === "GET") {
    return [
      {
        id: "mock_task_1",
        user_id: "1",
        title: "Sample Task",
        description: "This is a sample task",
        due_date: new Date(Date.now() + 86400000).toISOString(),
        priority: 3,
        created_at: new Date().toISOString(),
      },
    ] as unknown as T
  }

  if (path === "/v1/tasks/" && method === "POST") {
    const taskBody = body as { title: string; description: string; due_date: string; priority: number };
    return {
      id: "mock_task_" + Date.now(),
      user_id: "1",
      title: taskBody.title,
      description: taskBody.description,
      due_date: taskBody.due_date,
      priority: taskBody.priority,
      created_at: new Date().toISOString(),
    } as unknown as T
  }

  // Calendar endpoints
  if (path === "/v1/calendars/" && method === "GET") {
    return [
      {
        id: "mock_calendar_1",
        user_id: 1,
        name: "My Calendar",
        provider: "app",
        external_calendar_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ] as unknown as T
  }

  if (path === "/v1/calendars/events/list" && method === "POST") {
    const eventBody = body as { calendar_id: string };
    return [
      {
        id: "mock_event_1",
        calendar_id: eventBody.calendar_id,
        title: "Sample Event",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString(),
        created_at: new Date().toISOString(),
      },
    ] as unknown as T
  }

  // Default response
  return { success: true, message: "Mock response" } as unknown as T
}

// Main API request function
export async function apiRequest<T>({
  method,
  path,
  body,
  params,
  requiresAuth = false,
  contentType = "application/json",
}: ApiRequestOptions): Promise<T> {
  // Handle preview environment
  if (isPreviewEnvironment()) {
    return getMockResponse<T>(method, path, body)
  }

  // Construct URL
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  const url = new URL(`${API_BASE_URL}${cleanPath}`)

  // Add query parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }

  // Setup headers
  const headers: HeadersInit = {}

  if (contentType === "application/json") {
    headers["Content-Type"] = "application/json"
  } else if (contentType === "application/x-www-form-urlencoded") {
    headers["Content-Type"] = "application/x-www-form-urlencoded"
  }

  // Add authorization header
  if (requiresAuth && typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    } else {
      throw new APIRequestError("Authentication required", 401, "No token found")
    }
  }

  // Setup request options
  const options: RequestInit = {
    method,
    headers,
  }

  // Add body for non-GET requests
  if (body && method !== "GET") {
    if (contentType === "application/json") {
      options.body = JSON.stringify(body)
    } else if (contentType === "application/x-www-form-urlencoded") {
      options.body = body as string
    }
  }

  try {
    // Add timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)
    options.signal = controller.signal

    console.log(`API Request: ${method} ${url.toString()}`)

    const response = await fetch(url.toString(), options)
    clearTimeout(timeoutId)

    // Handle response
    const contentTypeHeader = response.headers.get("content-type")
    let data: unknown

    if (contentTypeHeader && contentTypeHeader.includes("application/json")) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      // Handle specific error types based on OpenAPI spec
      const errorData = data as { detail?: string; message?: string }
      
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
        }
        throw new APIRequestError("Unauthorized", 401, errorData.detail || "Authentication failed")
      }

      if (response.status === 403) {
        throw new APIRequestError("Forbidden", 403, errorData.detail || "Access denied")
      }

      if (response.status === 404) {
        throw new APIRequestError("Not Found", 404, errorData.detail || "Resource not found")
      }

      if (response.status === 422) {
        // Validation error
        const validationError = data as HTTPValidationError
        const errorMessages = validationError.detail?.map((err) => `${err.loc.join(".")}: ${err.msg}`).join(", ")
        throw new APIRequestError("Validation Error", 422, errorMessages || "Validation failed")
      }

      if (response.status === 400) {
        throw new APIRequestError("Bad Request", 400, errorData.detail || "Bad request")
      }

      if (response.status === 500) {
        throw new APIRequestError("Server Error", 500, errorData.detail || "Internal server error")
      }

      // Generic error
      throw new APIRequestError(
        `Request failed with status ${response.status}`,
        response.status,
        errorData.detail || errorData.message || "Unknown error",
      )
    }

    return data as T
  } catch (error) {
    if (error instanceof APIRequestError) {
      throw error
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new APIRequestError("Request timeout", 408, "Request timed out")
      }
      throw new APIRequestError("Network Error", 0, error.message)
    }

    throw new APIRequestError("Unknown Error", 0, "An unknown error occurred")
  }
}

// Authentication API - Matching OpenAPI spec exactly
export const authAPI = {
  async register(userData: UserCreate): Promise<Token> {
    return apiRequest<Token>({
      method: "POST",
      path: "/v1/OAuth/register",
      body: userData,
    })
  },

  async login(username: string, password: string): Promise<Token> {
    const formData = new URLSearchParams()
    formData.append("username", username)
    formData.append("password", password)
    formData.append("grant_type", "password")

    return apiRequest<Token>({
      method: "POST",
      path: "/v1/OAuth/login",
      body: formData.toString(),
      contentType: "application/x-www-form-urlencoded",
    })
  },

  async verifyEmail(token: string): Promise<MessageResponse> {
    return apiRequest<MessageResponse>({
      method: "GET",
      path: "/v1/OAuth/verify-email",
      params: { token },
    })
  },

  async requestPasswordReset(data: PasswordResetRequest): Promise<MessageResponse> {
    return apiRequest<MessageResponse>({
      method: "POST",
      path: "/v1/OAuth/reset-password/request",
      body: data,
    })
  },

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<MessageResponse> {
    return apiRequest<MessageResponse>({
      method: "POST",
      path: "/v1/OAuth/reset-password/",
      body: data,
    })
  },

  async setup2FA(): Promise<TwoFactorSetupResponse> {
    return apiRequest<TwoFactorSetupResponse>({
      method: "POST",
      path: "/v1/OAuth/2fa/setup",
      requiresAuth: true,
    })
  },

  async verify2FA(data: TwoFactorVerify): Promise<MessageResponse> {
    return apiRequest<MessageResponse>({
      method: "POST",
      path: "/v1/OAuth/2fa/verify",
      body: data,
      requiresAuth: true,
    })
  },

  // OAuth providers
  async googleLogin(): Promise<void> {
    // This endpoint redirects to Google OAuth, so we can't call it directly via fetch
    throw new Error("Use Google OAuth service signInViaBackend method instead")
  },

  async githubLogin(): Promise<void> {
    // This endpoint redirects to GitHub OAuth, so we can't call it directly via fetch
    throw new Error("Use GitHub OAuth service instead")
  },
}

// User API - Matching OpenAPI spec exactly
export const userAPI = {
  async getCurrentUser(): Promise<{ id: number; username: string; email: string; is_active: boolean; is_admin: boolean; created_at: string }> {
    return apiRequest<{ id: number; username: string; email: string; is_active: boolean; is_admin: boolean; created_at: string }>({
      method: "GET",
      path: "/v1/user/me",
      requiresAuth: true,
    })
  },

  async updateProfile(data: ProfileUpdate): Promise<{ id: number; username: string; email: string; is_active: boolean; is_admin: boolean; created_at: string }> {
    return apiRequest<{ id: number; username: string; email: string; is_active: boolean; is_admin: boolean; created_at: string }>({
      method: "PUT",
      path: "/v1/user/profile",
      body: data,
      requiresAuth: true,
    })
  },

  async deactivateAccount(): Promise<MessageResponse> {
    return apiRequest<MessageResponse>({
      method: "POST",
      path: "/v1/user/deactivate",
      requiresAuth: true,
    })
  },

  async generateApiKey(): Promise<ApiKeyResponse> {
    return apiRequest<ApiKeyResponse>({
      method: "POST",
      path: "/v1/user/generate-api-key",
      requiresAuth: true,
    })
  },
}

// Task API - Matching OpenAPI spec exactly
export const taskAPI = {
  async getTasks(): Promise<TaskOut[]> {
    return apiRequest<TaskOut[]>({
      method: "GET",
      path: "/v1/tasks/",
      requiresAuth: true,
    })
  },

  async createTask(data: TaskCreate): Promise<TaskOut> {
    return apiRequest<TaskOut>({
      method: "POST",
      path: "/v1/tasks/",
      body: data,
      requiresAuth: true,
    })
  },

  async getTask(data: TaskDelete): Promise<TaskOut> {
    return apiRequest<TaskOut>({
      method: "POST",
      path: "/v1/tasks/get",
      body: data,
      requiresAuth: true,
    })
  },

  async updateTask(data: TaskUpdate): Promise<TaskOut> {
    return apiRequest<TaskOut>({
      method: "POST",
      path: "/v1/tasks/update",
      body: data,
      requiresAuth: true,
    })
  },

  async deleteTask(data: TaskDelete): Promise<StringIDResponse> {
    return apiRequest<StringIDResponse>({
      method: "POST",
      path: "/v1/tasks/delete",
      body: data,
      requiresAuth: true,
    })
  },
}

// Calendar API - Matching OpenAPI spec exactly
export const calendarAPI = {
  async getCalendars(): Promise<CalendarOut[]> {
    return apiRequest<CalendarOut[]>({
      method: "GET",
      path: "/v1/calendars/",
      requiresAuth: true,
    })
  },

  async createCalendar(data: CalendarCreate): Promise<CalendarOut> {
    return apiRequest<CalendarOut>({
      method: "POST",
      path: "/v1/calendars/",
      body: data,
      requiresAuth: true,
    })
  },

  async getEvents(data: CalendarEvent): Promise<EventOut[]> {
    return apiRequest<EventOut[]>({
      method: "POST",
      path: "/v1/calendars/events/list",
      body: data,
    })
  },

  async createEvent(data: EventCreate): Promise<EventOut> {
    return apiRequest<EventOut>({
      method: "POST",
      path: "/v1/calendars/events/create",
      body: data,
    })
  },

  async getCalendarICS(data: CalendarEvent): Promise<string> {
    return apiRequest<string>({
      method: "POST",
      path: "/v1/calendars/ics",
      body: data,
    })
  },
}

// Habit API - Matching OpenAPI spec exactly
export const habitAPI = {
  async getHabits(): Promise<HabitOut[]> {
    return apiRequest<HabitOut[]>({
      method: "GET",
      path: "/v1/habits/",
      requiresAuth: true,
    })
  },

  async createHabit(data: HabitCreate): Promise<HabitOut> {
    return apiRequest<HabitOut>({
      method: "POST",
      path: "/v1/habits/",
      body: data,
      requiresAuth: true,
    })
  },

  async getHabit(data: HabitDelete): Promise<HabitOut> {
    return apiRequest<HabitOut>({
      method: "POST",
      path: "/v1/habits/get",
      body: data,
      requiresAuth: true,
    })
  },

  async updateHabit(data: HabitUpdate): Promise<HabitOut> {
    return apiRequest<HabitOut>({
      method: "POST",
      path: "/v1/habits/update",
      body: data,
      requiresAuth: true,
    })
  },

  async deleteHabit(data: HabitDelete): Promise<StringIDResponse> {
    return apiRequest<StringIDResponse>({
      method: "POST",
      path: "/v1/habits/delete",
      body: data,
      requiresAuth: true,
    })
  },
}

// Notification API - Matching OpenAPI spec exactly
export const notificationAPI = {
  async getNotifications(userId?: number, limit = 20): Promise<NotificationRead[]> {
    return apiRequest<NotificationRead[]>({
      method: "GET",
      path: "/v1/notifications",
      params: { ...(userId && { user_id: userId }), limit },
      requiresAuth: true,
    })
  },

  async createNotification(data: NotificationCreate): Promise<NotificationRead> {
    return apiRequest<NotificationRead>({
      method: "POST",
      path: "/v1/notifications",
      body: data,
      requiresAuth: true,
    })
  },

  async getNotification(notificationId: string): Promise<NotificationRead> {
    return apiRequest<NotificationRead>({
      method: "GET",
      path: `/v1/notifications/${notificationId}`,
      requiresAuth: true,
    })
  },

  async markAsRead(notificationId: string): Promise<NotificationRead> {
    return apiRequest<NotificationRead>({
      method: "PUT",
      path: `/v1/notifications/${notificationId}/read`,
      requiresAuth: true,
    })
  },
}

// Export the original apiRequest for backward compatibility
