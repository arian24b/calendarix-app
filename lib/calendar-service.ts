// Calendar and event API services
import { api } from "./api-client"
import type { CalendarCreate, CalendarOut, EventCreate, EventOut } from "@/types/api"

// Calendar functions
export async function listCalendars(): Promise<CalendarOut[]> {
  return api.get<CalendarOut[]>("/v1/calendars/")
}

export async function createCalendar(data: CalendarCreate): Promise<CalendarOut> {
  return api.post<CalendarOut>("/v1/calendars/", data)
}

// Event functions
export async function listEvents(calendarId: string): Promise<EventOut[]> {
  return api.get<EventOut[]>(`/v1/calendars/${calendarId}/events`)
}

export async function createEvent(calendarId: string, data: EventCreate): Promise<EventOut> {
  return api.post<EventOut>(`/v1/calendars/${calendarId}/events`, data)
}

export async function getCalendarIcs(calendarId: string): Promise<string> {
  return api.get<string>(`/v1/calendars/${calendarId}/ics`)
}

// Helper function to convert API event to app event format
export function mapApiEventToAppEvent(event: EventOut) {
  return {
    id: event.id,
    title: event.title,
    start: new Date(event.start_time),
    end: event.end_time ? new Date(event.end_time) : undefined,
    calendarId: event.calendar_id,
  }
}

// Helper function to convert app event to API event format
export function mapAppEventToApiEvent(event: any): EventCreate {
  return {
    title: event.title,
    start_time: event.start.toISOString(),
    end_time: event.end ? event.end.toISOString() : undefined,
  }
}
