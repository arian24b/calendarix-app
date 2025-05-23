import { apiRequest } from "../api-client"

export interface CalendarCreate {
  name: string
  provider: string
}

export interface CalendarOut {
  id: string
  user_id: number
  name: string
  provider: string
  external_calendar_id: string | null
  created_at: string
  updated_at: string | null
}

export interface EventCreate {
  title: string
  start_time: string
  end_time?: string | null
  calendar_id?: string
}

export interface EventOut {
  id: string
  calendar_id: string
  title: string
  start_time: string
  end_time: string | null
  created_at: string
  updated_at: string | null
}

// Define a type for storing events in local storage
export interface LocalEvent {
  id: string
  title: string
  start: Date | string
  end?: Date | string
  description?: string
  calendar_id?: string
  created_at?: string
  updated_at?: string | null
}

// Check if we're in a preview/demo environment
function isPreviewEnvironment(): boolean {
  return (
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL.includes("localhost") ||
    (typeof window !== "undefined" && window.location.hostname.includes("v0.dev"))
  )
}

// Check if user is logged in
function isUserLoggedIn(): boolean {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem("token")

  // Basic token validation
  if (token) {
    try {
      // Check if token is a valid JWT format (simple check)
      const parts = token.split('.')
      if (parts.length === 3) {
        // Valid token format
        return true
      } else {
        // Invalid token format, clear it
        localStorage.removeItem("token")
        return false
      }
    } catch {
      // Error validating token
      localStorage.removeItem("token")
      return false
    }
  }

  return false
}

// Get stored events from localStorage
function getStoredEvents(): LocalEvent[] {
  if (typeof window === "undefined") return []

  const storedEvents = localStorage.getItem("localEvents")
  if (storedEvents) {
    try {
      return JSON.parse(storedEvents)
    } catch {
      return []
    }
  }
  return []
}

// Store events in localStorage
function storeLocalEvents(events: LocalEvent[]): void {
  if (typeof window === "undefined") return

  localStorage.setItem("localEvents", JSON.stringify(events))
}

// Get mock calendars
function getMockCalendars(): CalendarOut[] {
  return [
    {
      id: "mock_calendar_1",
      user_id: 1,
      name: "My Calendar",
      provider: "app",
      external_calendar_id: null,
      created_at: new Date().toISOString(),
      updated_at: null,
    },
  ]
}

// Get mock events
function getMockEvents(): EventOut[] {
  const storedEvents = getStoredEvents()

  if (storedEvents.length > 0) {
    // Convert stored events to API format
    return storedEvents.map((event: LocalEvent) => ({
      id: event.id || String(Date.now()),
      calendar_id: "mock_calendar_1",
      title: event.title,
      start_time: typeof event.start === "string" ? event.start : new Date(event.start).toISOString(),
      end_time: event.end ? (typeof event.end === "string" ? event.end : new Date(event.end).toISOString()) : null,
      created_at: event.created_at || new Date().toISOString(),
      updated_at: event.updated_at || null,
    }))
  }

  // Default mock events
  return [
    {
      id: "1",
      calendar_id: "mock_calendar_1",
      title: "Design new UX flow",
      start_time: new Date(2025, 4, 15, 10, 0).toISOString(),
      end_time: new Date(2025, 4, 15, 12, 0).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: null,
    },
    {
      id: "2",
      calendar_id: "mock_calendar_1",
      title: "Team meeting",
      start_time: new Date(2025, 4, 16, 14, 0).toISOString(),
      end_time: new Date(2025, 4, 16, 15, 0).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: null,
    },
  ]
}

// Synchronize local events with server when user is logged in
async function synchronizeEvents(calendarId: string): Promise<void> {
  if (!isUserLoggedIn() || typeof window === "undefined") return

  try {
    // Get local events
    const localEvents = getStoredEvents()

    // No local events, nothing to synchronize
    if (localEvents.length === 0) return

    // Get server events
    const serverEvents = await apiRequest<EventOut[]>({
      method: "POST",
      path: "/v1/calendars/events/list",
      body: { calendar_id: calendarId } as Record<string, unknown>,
      requiresAuth: true,
    })

    if (!Array.isArray(serverEvents)) {
      console.warn("Invalid server events response during synchronization")
      return
    }

    // Create a map of server events by ID for faster lookups
    const serverEventMap = new Map<string, EventOut>()
    serverEvents.forEach(event => {
      if (event && event.id) {
        serverEventMap.set(event.id, event)
      }
    })

    // Identify local events that need to be synchronized to server
    const localOnlyEvents = localEvents.filter(event =>
      event.id && !event.id.startsWith('temp_') && !serverEventMap.has(event.id)
    )

    // Add temporary IDs for events that need one
    const tempLocalEvents = localEvents.filter(event => !event.id || event.id.startsWith('temp_'))

    // Combine both sets of local events that need syncing
    const eventsToSync = [...localOnlyEvents, ...tempLocalEvents]

    if (eventsToSync.length === 0) {
      console.log("No local events need synchronizing")
      return
    }

    console.log(`Synchronizing ${eventsToSync.length} local events to server`)

    // Define the type for our sync result
    interface SyncResult {
      success: boolean;
      localId: string | undefined;
      serverId?: string;
    }

    // Upload local-only events to server
    const syncPromises = eventsToSync.map(async (localEvent) => {
      const eventData = {
        title: localEvent.title,
        start_time: typeof localEvent.start === "string" ? localEvent.start : new Date(localEvent.start).toISOString(),
        end_time: localEvent.end ?
          (typeof localEvent.end === "string" ? localEvent.end : new Date(localEvent.end).toISOString()) :
          null,
      }

      try {
        const serverEvent = await apiRequest<EventOut>({
          method: "POST",
          path: "/v1/calendars/events/create",
          body: {
            ...eventData,
            calendar_id: calendarId,
          } as Record<string, unknown>,
          requiresAuth: true,
        })

        const result: SyncResult = {
          success: true,
          localId: localEvent.id,
          serverId: serverEvent.id,
        }
        return result
      } catch (error) {
        console.error("Error synchronizing local event to server:", error)
        const result: SyncResult = {
          success: false,
          localId: localEvent.id,
        }
        return result
      }
    })

    const results = await Promise.allSettled(syncPromises)

    // Update local events with server IDs for successfully synced events
    const successfulSyncs: SyncResult[] = []

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const sync = result.value
        if (sync.success && sync.localId && sync.serverId) {
          successfulSyncs.push(sync)
        }
      }
    })

    if (successfulSyncs.length > 0) {
      // Create a mapping of local to server IDs
      const idMapping = new Map<string, string>()
      successfulSyncs.forEach(sync => {
        if (sync.localId && sync.serverId) {
          idMapping.set(sync.localId, sync.serverId)
        }
      })

      // Update local storage with new server IDs
      if (idMapping.size > 0) {
        const updatedLocalEvents = localEvents.map(event => {
          if (event.id) {
            const serverId = idMapping.get(event.id)
            if (serverId) {
              return { ...event, id: serverId }
            }
          }
          return event
        })

        storeLocalEvents(updatedLocalEvents)
        console.log(`Updated ${idMapping.size} local events with server IDs`)
      }
    }
  } catch (error) {
    console.error("Error during event synchronization:", error)
    throw new Error("Event synchronization failed: " + (error instanceof Error ? error.message : String(error)))
  }
}

export async function getCalendars(): Promise<CalendarOut[]> {
  if (isPreviewEnvironment() || !isUserLoggedIn()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockCalendars()
  }

  try {
    return await apiRequest<CalendarOut[]>({
      method: "GET",
      path: "/v1/calendars/",
      requiresAuth: true,
    })
  } catch (error) {
    console.error("Error fetching calendars:", error)
    return getMockCalendars()
  }
}

export async function createCalendar(data: CalendarCreate): Promise<CalendarOut> {
  if (isPreviewEnvironment() || !isUserLoggedIn()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      id: "mock_calendar_" + Date.now(),
      user_id: 1,
      name: data.name,
      provider: data.provider,
      external_calendar_id: null,
      created_at: new Date().toISOString(),
      updated_at: null,
    }
  }

  try {
    return await apiRequest<CalendarOut>({
      method: "POST",
      path: "/v1/calendars/",
      body: data as unknown as Record<string, unknown>,
      requiresAuth: true,
    })
  } catch (error) {
    console.error("Error creating calendar:", error)
    return {
      id: "mock_calendar_" + Date.now(),
      user_id: 1,
      name: data.name,
      provider: data.provider,
      external_calendar_id: null,
      created_at: new Date().toISOString(),
      updated_at: null,
    }
  }
}

export async function getEvents(calendarId: string): Promise<EventOut[]> {
  // Try to synchronize events first if user is logged in
  if (isUserLoggedIn() && !isPreviewEnvironment()) {
    try {
      await synchronizeEvents(calendarId)
    } catch (syncError) {
      console.warn("Event synchronization failed, continuing with local data:", syncError)
      // Continue - we'll still try to get events below
    }
  }

  if (isPreviewEnvironment() || !isUserLoggedIn()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return getMockEvents()
  }

  try {
    // Make the API request with retry logic
    let retries = 0;
    const maxRetries = 2;
    let serverEvents: EventOut[] | null = null;

    while (retries <= maxRetries) {
      try {
        const requestBody = { calendar_id: calendarId } as unknown as Record<string, unknown>;
        const response = await apiRequest<EventOut[]>({
          method: "POST",
          path: "/v1/calendars/events/list",
          body: requestBody,
          requiresAuth: true,
        });

        serverEvents = response;
        break; // Success, exit the retry loop
      } catch (requestError) {
        console.error(`API request attempt ${retries + 1}/${maxRetries + 1} failed:`, requestError);
        retries++;

        if (retries <= maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
        } else {
          // We've exhausted our retries, throw the error to be caught by the outer catch
          throw requestError;
        }
      }
    }

    // Validate the response and update local storage
    if (serverEvents && Array.isArray(serverEvents)) {
      // Type guard to ensure we have valid events
      const validEvents = serverEvents.filter(event => {
        return event &&
               typeof event === 'object' &&
               'id' in event &&
               'title' in event &&
               'start_time' in event;
      });

      if (validEvents.length > 0) {
        const formattedLocalEvents = validEvents.map(event => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start_time),
          end: event.end_time ? new Date(event.end_time) : undefined,
          description: "",
          calendar_id: event.calendar_id,
        }));

        storeLocalEvents(formattedLocalEvents);
        return validEvents;
      }
    }

    console.warn("Server returned invalid events data, falling back to local data");
    return getMockEvents();
  } catch (error) {
    console.error("Error fetching events:", error);
    return getMockEvents();
  }
}

export async function createEvent(calendarId: string, eventData: Omit<EventCreate, "calendar_id">): Promise<EventOut> {
  // Create a new event object
  const newEvent = {
    id: String(Date.now()),
    calendar_id: calendarId,
    title: eventData.title,
    start_time: eventData.start_time,
    end_time: eventData.end_time || null,
    created_at: new Date().toISOString(),
    updated_at: null,
  }

  // Store in localStorage for offline access and to prevent data loss
  const storedEvents = getStoredEvents()
  const formattedEvent: LocalEvent = {
    id: newEvent.id,
    title: newEvent.title,
    start: new Date(newEvent.start_time as string), // Type assertion needed for Record<string, unknown>
    end: newEvent.end_time ? new Date(newEvent.end_time as string) : undefined,
    description: "",
    calendar_id: calendarId,
  }

  storeLocalEvents([...storedEvents, formattedEvent])

  // If in preview environment or user not logged in, just use local storage
  if (isPreviewEnvironment() || !isUserLoggedIn()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return newEvent as unknown as EventOut // Type assertion since we know the structure matches
  }

  // Try to create the event on the server
  try {
    const requestBody = {
      ...eventData,
      calendar_id: calendarId,
    } as unknown as Record<string, unknown>;

    const serverEvent = await apiRequest<EventOut>({
      method: "POST",
      path: "/v1/calendars/events/create",
      body: requestBody,
      requiresAuth: true,
    })

    // Update local storage with the server-generated ID
    const updatedStoredEvents = getStoredEvents().map(event =>
      event.id === formattedEvent.id
        ? { ...event, id: serverEvent.id }
        : event
    )
    storeLocalEvents(updatedStoredEvents)

    return serverEvent
  } catch (error) {
    console.error("Error creating event on server:", error)
    // Return the locally created event if server creation fails
    return newEvent
  }
}

export async function updateEvent(eventId: string, calendarId: string, eventData: Omit<EventCreate, "calendar_id">): Promise<EventOut> {
  // Update in local storage first
  const storedEvents = getStoredEvents()
  const updatedLocalEvents = storedEvents.map(event => {
    if (event.id === eventId) {
      return {
        ...event,
        title: eventData.title,
        start: new Date(eventData.start_time as string), // Type assertion for safety
        end: eventData.end_time ? new Date(eventData.end_time as string) : undefined,
        updated_at: new Date().toISOString()
      } as LocalEvent
    }
    return event
  })

  storeLocalEvents(updatedLocalEvents)

  // Create response object for local update
  const updatedEvent = {
    id: eventId,
    calendar_id: calendarId,
    title: eventData.title,
    start_time: eventData.start_time,
    end_time: eventData.end_time || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as unknown as EventOut

  // If in preview environment or user not logged in, just use local storage
  if (isPreviewEnvironment() || !isUserLoggedIn()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return updatedEvent
  }

  // Try to update on server
  try {
    const requestBody = {
      ...eventData,
      calendar_id: calendarId,
    } as unknown as Record<string, unknown>;

    return await apiRequest<EventOut>({
      method: "PUT",
      path: `/v1/calendars/events/${eventId}`,
      body: requestBody,
      requiresAuth: true,
    })
  } catch (error) {
    console.error("Error updating event on server:", error)
    return updatedEvent
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  // Delete from local storage first
  const storedEvents = getStoredEvents()
  const filteredEvents = storedEvents.filter(event => event.id !== eventId)
  storeLocalEvents(filteredEvents)

  // If in preview environment or user not logged in, just use local storage
  if (isPreviewEnvironment() || !isUserLoggedIn()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  }

  // Try to delete from server
  try {
    await apiRequest({
      method: "DELETE",
      path: `/v1/calendars/events/${eventId}`,
      requiresAuth: true,
    })
    return true
  } catch (error) {
    console.error("Error deleting event from server:", error)
    return true // Return true anyway since we've already deleted from local storage
  }
}

export interface ICSResponse {
  ics: string;
}

export async function getCalendarIcs(calendarId: string): Promise<ICSResponse> {
  if (isPreviewEnvironment() || !isUserLoggedIn()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { ics: "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Mock//Calendar//EN\nEND:VCALENDAR" }
  }

  try {
    const requestBody = { calendar_id: calendarId } as unknown as Record<string, unknown>;

    return await apiRequest<ICSResponse>({
      method: "POST",
      path: "/v1/calendars/ics",
      body: requestBody,
      requiresAuth: true,
    })
  } catch (error) {
    console.error("Error getting calendar ICS:", error)
    return { ics: "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Mock//Calendar//EN\nEND:VCALENDAR" }
  }
}
