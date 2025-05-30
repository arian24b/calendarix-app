// Google Calendar Integration Service
interface GoogleCalendarEvent {
  id: string
  summary: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  description?: string
}

interface GoogleCalendarConfig {
  apiKey: string
  clientId: string
  discoveryDoc: string
  scopes: string
}

class GoogleCalendarService {
  private gapi: any = null
  private isInitialized = false
  private config: GoogleCalendarConfig

  constructor() {
    this.config = {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      discoveryDoc: "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      scopes: "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Load Google API
      await this.loadGoogleAPI()

      if (typeof window !== "undefined" && window.gapi) {
        this.gapi = window.gapi

        await this.gapi.load("client:auth2", async () => {
          await this.gapi.client.init({
            apiKey: this.config.apiKey,
            clientId: this.config.clientId,
            discoveryDocs: [this.config.discoveryDoc],
            scope: this.config.scopes,
          })

          this.isInitialized = true
        })
      }
    } catch (error) {
      console.error("Failed to initialize Google Calendar API:", error)
      throw error
    }
  }

  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Google API can only be loaded in browser"))
        return
      }

      if (window.gapi) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = "https://apis.google.com/js/api.js"
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load Google API"))
      document.head.appendChild(script)
    })
  }

  async signIn(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const authInstance = this.gapi.auth2.getAuthInstance()
      const user = await authInstance.signIn()
      return user.isSignedIn()
    } catch (error) {
      console.error("Google Calendar sign-in failed:", error)
      return false
    }
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized) return

    try {
      const authInstance = this.gapi.auth2.getAuthInstance()
      await authInstance.signOut()
    } catch (error) {
      console.error("Google Calendar sign-out failed:", error)
    }
  }

  async getCalendars(): Promise<any[]> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const response = await this.gapi.client.calendar.calendarList.list()
      return response.result.items || []
    } catch (error) {
      console.error("Failed to fetch Google calendars:", error)
      return []
    }
  }

  async getEvents(calendarId = "primary", timeMin?: string, timeMax?: string): Promise<GoogleCalendarEvent[]> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const now = new Date()
      const params: any = {
        calendarId,
        timeMin: timeMin || now.toISOString(),
        timeMax: timeMax || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      }

      const response = await this.gapi.client.calendar.events.list(params)
      return response.result.items || []
    } catch (error) {
      console.error("Failed to fetch Google Calendar events:", error)
      return []
    }
  }

  async createEvent(calendarId = "primary", event: any): Promise<GoogleCalendarEvent | null> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const response = await this.gapi.client.calendar.events.insert({
        calendarId,
        resource: event,
      })
      return response.result
    } catch (error) {
      console.error("Failed to create Google Calendar event:", error)
      return null
    }
  }

  isSignedIn(): boolean {
    if (!this.isInitialized || !this.gapi) return false

    try {
      const authInstance = this.gapi.auth2.getAuthInstance()
      return authInstance.isSignedIn.get()
    } catch {
      return false
    }
  }
}

export const googleCalendarService = new GoogleCalendarService()
