"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreVertical, Circle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { BottomNav } from "@/components/bottom-nav"
import { toast } from "sonner"
import { getCalendars, getEvents, formatEventFromAPI } from "@/lib/api-services"

interface Event {
  id: string
  title: string
  start: Date
  end?: Date
  description?: string
  location?: string
  color?: string
}

export default function EventsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("today")
  const [searchQuery, setSearchQuery] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [calendarId, setCalendarId] = useState<string | null>(null)

  // Mock alarms data - since there's no alarm API in the spec
  const alarms = [
    {
      id: 1,
      title: "breakfast time!",
      time: "6:00",
      period: "AM",
      date: "Tomorrow-Thu,Sep 2",
      enabled: true,
      type: "Sleep",
    },
    {
      id: 2,
      title: "breakfast time!",
      time: "6:00",
      period: "AM",
      date: "Tomorrow-Thu,Sep 2",
      enabled: true,
      type: "Sleep",
    },
  ]

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // Fetch calendars and events
    const fetchEvents = async () => {
      try {
        setIsLoading(true)

        // Get user calendars
        const calendars = await getCalendars()

        if (calendars.length > 0) {
          const defaultCalendar = calendars[0]
          setCalendarId(defaultCalendar.id)

          // Get events for this calendar
          const apiEvents = await getEvents(defaultCalendar.id)

          // Map API events to app format
          const formattedEvents = apiEvents.map(formatEventFromAPI)
          setEvents(formattedEvents)
        } else {
          setEvents([])
        }
      } catch (error) {
        console.error("Error fetching events:", error)
        toast.error("Failed to load events")
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [router])

  // Filter events based on active tab
  const getFilteredEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()))

    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    return events
      .filter((event) => {
        // Apply search filter
        if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false
        }

        // Apply date filter
        if (activeTab === "today") {
          return event.start >= today && event.start <= endOfToday
        } else if (activeTab === "week") {
          return event.start >= today && event.start <= endOfWeek
        } else if (activeTab === "month") {
          return event.start >= today && event.start <= endOfMonth
        }

        return true
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime())
  }

  const filteredEvents = getFilteredEvents()

  const toggleAlarm = (id: number) => {
    // In a real app, you would update the state here
    console.log(`Toggling alarm ${id}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">All Events</h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search"
            className="pl-10 border-gray-300 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-200">
          <Button
            variant={activeTab === "today" ? "default" : "ghost"}
            className={`flex-1 rounded-none ${
              activeTab === "today" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => setActiveTab("today")}
          >
            TODAY
          </Button>
          <Button
            variant={activeTab === "week" ? "default" : "ghost"}
            className={`flex-1 rounded-none ${
              activeTab === "week" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => setActiveTab("week")}
          >
            WEEK
          </Button>
          <Button
            variant={activeTab === "month" ? "default" : "ghost"}
            className={`flex-1 rounded-none ${
              activeTab === "month" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => setActiveTab("month")}
          >
            MONTH
          </Button>
        </div>

        <div className="space-y-6">
          {/* Events */}
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="relative group">
                <div className="flex items-start">
                  <div className="flex items-center mr-3">
                    <Circle className="h-4 w-4 text-indigo-600 fill-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="text-sm text-indigo-600">
                        {`${event.start.getHours().toString().padStart(2, "0")}:${event.start.getMinutes().toString().padStart(2, "0")}`}
                        {event.end &&
                          `-${event.end.getHours().toString().padStart(2, "0")}:${event.end.getMinutes().toString().padStart(2, "0")}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-800">{event.title}</h3>
                    {event.description && (
                      <>
                        <p className="text-sm text-gray-500">{event.description.substring(0, 50)}...</p>
                        <button className="text-sm text-indigo-600 mt-1">View more</button>
                      </>
                    )}
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">No events found for this period</div>
          )}

          {/* Alarms */}
          {alarms.map((alarm) => (
            <div key={alarm.id} className="mt-8">
              <h3 className="text-gray-600 mb-2">{alarm.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-5xl font-semibold text-gray-700">
                    {alarm.time.split(":")[0]}
                    <span className="mx-2">:</span>
                    {alarm.time.split(":")[1]}
                  </div>
                  <div className="ml-2 text-xl text-gray-500">{alarm.period}</div>
                </div>
                <div className="text-indigo-600">{alarm.date}</div>
              </div>
              <div className="mt-2 flex items-center">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-1">
                  <Circle className="h-3 w-3 text-indigo-600 fill-indigo-600 mr-2" />
                  <span className="text-sm text-gray-700">{alarm.type}</span>
                </div>
                <div className="ml-auto">
                  <Switch checked={alarm.enabled} onCheckedChange={() => toggleAlarm(alarm.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav currentPath="/events" />
    </div>
  )
}
