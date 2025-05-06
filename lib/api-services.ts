// API service for calendar and events

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `API error: ${response.status}`)
  }
  return response.json() as Promise<T>
}

// Get auth header
function getAuthHeader() {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Calendar API functions
export async function getCalendars() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/calendars/`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  return handleResponse(response)
}

export async function createCalendar(data: { name: string; provider: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/calendars/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  })
  return handleResponse(response)
}

// Events API functions
export async function getEvents(calendarId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/calendars/${calendarId}/events`, {
    headers: {
      ...getAuthHeader(),
    },
  })
  return handleResponse(response)
}

export async function createEvent(
  calendarId: string,
  data: {
    title: string
    start_time: string
    end_time?: string
    description?: string
    location?: string
  },
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/calendars/${calendarId}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  })
  return handleResponse(response)
}

// Event helpers
export function formatEventForAPI(event: any) {
  return {
    title: event.title,
    start_time: event.start.toISOString(),
    end_time: event.end ? event.end.toISOString() : undefined,
    description: event.description,
    location: event.location,
  }
}

export function formatEventFromAPI(event: any) {
  return {
    id: event.id,
    title: event.title,
    start: new Date(event.start_time),
    end: event.end_time ? new Date(event.end_time) : undefined,
    description: event.description || "",
    location: event.location || "",
  }
}
