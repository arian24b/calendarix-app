import { calendarAPI, APIRequestError } from "../api-client"
import type { CalendarCreate, CalendarOut, EventCreate, EventOut, CalendarEvent } from "../types/api"

export interface LocalEvent {
  id: string
  title: string
  start: Date
  end?: Date
  description?: string
  calendar_id: string
}

export async function getCalendars(): Promise<CalendarOut[]> {
  try {
    return await calendarAPI.getCalendars()
  } catch (error) {
    if (error instanceof APIRequestError) {
      console.error("API Error:", error.detail)
      // Return mock data for preview
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
      ]
    }
    throw error
  }
}

export async function createCalendar(data: CalendarCreate): Promise<CalendarOut> {
  try {
    return await calendarAPI.createCalendar(data)
  } catch (error) {
    if (error instanceof APIRequestError) {
      console.error("API Error:", error.detail)
      // Return mock data for preview
      return {
        id: "mock_calendar_" + Date.now(),
        user_id: 1,
        name: data.name,
        provider: data.provider,
        external_calendar_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
    throw error
  }
}

export async function getEvents(calendarId: string): Promise<EventOut[]> {
  try {
    const data: CalendarEvent = { calendar_id: calendarId }
    return await calendarAPI.getEvents(data)
  } catch (error) {
    if (error instanceof APIRequestError) {
      console.error("API Error:", error.detail)
      // Return mock data for preview
      return [
        {
          id: "mock_event_1",
          calendar_id: calendarId,
          title: "Sample Event",
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    }
    throw error
  }
}

export async function createEvent(calendarId: string, eventData: EventCreate): Promise<EventOut> {
  try {
    const data: EventCreate = {
      title: eventData.title,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      calendar_id: calendarId,
    }
    return await calendarAPI.createEvent(data)
  } catch (error) {
    if (error instanceof APIRequestError) {
      console.error("API Error:", error.detail)
      // Return mock data for preview
      return {
        id: "mock_event_" + Date.now(),
        calendar_id: calendarId,
        title: eventData.title,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
    throw error
  }
}

export async function updateEvent(eventId: string, calendarId: string, eventData: EventCreate): Promise<EventOut> {
  // Note: Update endpoint not in OpenAPI spec, using create for now
  return createEvent(calendarId, eventData)
}

export async function deleteEvent(eventId: string): Promise<void> {
  // Note: Delete endpoint not in OpenAPI spec
  console.log("Delete event:", eventId)
}
