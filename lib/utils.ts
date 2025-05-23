import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { EventOut } from "./services/calendar-service"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format event from API to app format
export function formatEventFromAPI(event: EventOut) {
  return {
    id: event.id,
    title: event.title,
    start: new Date(event.start_time),
    end: event.end_time ? new Date(event.end_time) : undefined,
    description: "",
  }
}

// Format event from app format to API format
export function formatEventForAPI(event: any) {
  return {
    title: event.title,
    start_time: event.start.toISOString(),
    end_time: event.end ? event.end.toISOString() : null,
  }
}
