// Base API client for making authenticated requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

interface ApiRequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  body?: unknown
  params?: Record<string, string>
  requiresAuth?: boolean
}

// Check if we're in a preview/demo environment
function isPreviewEnvironment(): boolean {
  // Check if we're in a preview environment (no API URL set or localhost)
  return (
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL.includes("localhost") ||
    (typeof window !== "undefined" && window.location.hostname.includes("v0.dev"))
  )
}

export async function apiRequest<T>({
  method,
  path,
  body,
  params,
  requiresAuth = false,
}: ApiRequestOptions): Promise<T> {
  // If in preview environment, return mock data immediately
  if (isPreviewEnvironment()) {
    console.log("Preview environment detected, using mock data for:", path)
    return getMockResponse<T>(method, path, body) as T
  }

  const url = new URL(`${API_BASE_URL}${path}`)

  // Add query parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  // Add authorization header if required
  if (requiresAuth) {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication required")
      }

      // Check if token is a valid JWT format (simple check)
      const parts = token.split('.');
      if (parts.length !== 3) {
        localStorage.removeItem("token");
        throw new Error("Invalid token format");
      }

      headers["Authorization"] = `Bearer ${token}`
    } catch (error) {
      console.error("Auth error:", error);
      // Fall back to mock data on auth error
      console.warn("Auth error, falling back to mock data");
      return getMockResponse<T>(method, path, body) as T;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  }

  if (body && method !== "GET") {
    options.body = JSON.stringify(body)
  }

  try {
    // Add timeout to fetch requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    options.signal = controller.signal;

    const response = await fetch(url.toString(), options)

    // Clear the timeout since we got a response
    clearTimeout(timeoutId);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()

      if (!response.ok) {
        // If unauthorized, clear token and fall back to mock data
        if (response.status === 401) {
          localStorage.removeItem("token");
          console.warn("Unauthorized, falling back to mock data");
          return getMockResponse<T>(method, path, body) as T;
        }

        throw new Error(data.detail || `API request failed with status: ${response.status}`)
      }

      return data as T
    } else {
      if (!response.ok) {
        // If unauthorized, clear token and fall back to mock data
        if (response.status === 401) {
          localStorage.removeItem("token");
          console.warn("Unauthorized, falling back to mock data");
          return getMockResponse<T>(method, path, body) as T;
        }

        throw new Error(`API request failed with status: ${response.status}`)
      }

      return {} as T
    }
  } catch (error) {
    console.error("API request error:", error)

    // Check if the error was due to timeout
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn("Request timed out, falling back to mock data");
    } else if (error instanceof TypeError && error.message.includes("fetch")) {
      console.warn("Network error, falling back to mock data");
    }

    // Fallback to mock data on any error
    console.warn("API request failed, falling back to mock data")
    return getMockResponse<T>(method, path, body) as T
  }
}

// Enhanced mock response function
function getMockResponse<T>(method: string, path: string, body?: unknown): T {
  console.log(`Generating mock response for ${method} ${path}`)

  // Mock responses for different endpoints
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

  if (path === "/v1/calendars/" && method === "POST") {
    const bodyObj = body as Record<string, unknown> || {}
    return {
      id: "mock_calendar_" + Date.now(),
      user_id: 1,
      name: (bodyObj.name as string) || "New Calendar",
      provider: (bodyObj.provider as string) || "app",
      external_calendar_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as unknown as T
  }

  if (path === "/v1/calendars/events/list" && method === "POST") {
    const bodyObj = body as Record<string, unknown> || {}
    return [
      {
        id: "mock_event_1",
        calendar_id: (bodyObj.calendar_id as string) || "mock_calendar_1",
        title: "Mock Event 1",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: null,
      },
      {
        id: "mock_event_2",
        calendar_id: (bodyObj.calendar_id as string) || "mock_calendar_1",
        title: "Mock Event 2",
        start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        end_time: new Date(Date.now() + 90000000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: null,
      }
    ] as unknown as T
  }

  // Default mock response
  return { success: true, message: "Mock response" } as unknown as T
}
