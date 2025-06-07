"use client"

import { useState, useEffect } from "react"
import { Search, MoreVertical, Circle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { BottomNav } from "@/components/bottom-nav"
import { getEvents, getCalendars } from "@/lib/services/calendar-service"
import { getAlarms } from "@/lib/services/alarm-service"
import { cn } from "@/lib/utils"

type EventType = {
  id: string
  title: string
  start: Date
  end?: Date
  description?: string
  type: "event"
}

type AlarmType = {
  id: string
  time: string
  label: string
  isActive: boolean
  days: string[]
  type: "alarm"
}

type CombinedEvent = EventType | AlarmType

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"today" | "week" | "month">("today")
  const [allEvents, setAllEvents] = useState<CombinedEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<CombinedEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  )

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        // Get calendar events
        let calendarEvents: EventType[] = []

        try {
          // Use the calendar service directly - it has better error handling and offline support
          const calendars = await getCalendars();

          if (calendars && calendars.length > 0) {
            const calendarId = calendars[0].id
            // Get events for this calendar using enhanced service that handles offline mode
            const apiEvents = await getEvents(calendarId)

            if (apiEvents && Array.isArray(apiEvents)) {
              calendarEvents = apiEvents.map((event) => ({
                id: event.id,
                title: event.title,
                start: new Date(event.start_time),
                end: event.end_time ? new Date(event.end_time) : undefined,
                description: "",
                type: "event",
              }))
            } else {
              console.warn("Invalid events response format, using local data")
              calendarEvents = getMockEvents()
            }
          } else {
            console.warn("No calendars found, using local data")
            calendarEvents = getMockEvents()
          }
        } catch (error) {
          console.error("Error fetching calendar data:", error)
          calendarEvents = getMockEvents()
        }

        // Get alarms
        const alarms = getAlarms().map((alarm) => ({
          ...alarm,
          type: "alarm" as const,
        }))

        // Combine events and alarms
        const combined = [...calendarEvents, ...alarms]
        setAllEvents(combined)

        // Apply initial filter
        filterEvents(combined, activeFilter)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [activeFilter, isOnline]) // eslint-disable-line react-hooks/exhaustive-deps

  const getMockEvents = (): EventType[] => {
    const savedEvents = localStorage.getItem("localEvents")
    if (savedEvents) {
      try {
        return JSON.parse(savedEvents).map((event: EventType) => ({
          ...event,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : undefined,
          type: "event",
        }))
      } catch (error) {
        console.error("Error parsing local events:", error)
        return getDefaultMockEvents()
      }
    }
    return getDefaultMockEvents()
  }

  const getDefaultMockEvents = (): EventType[] => {
    // Default mock events
    return [
      {
        id: "1",
        title: "Brainstorm with the team",
        start: new Date(2025, 2, 7, 14, 0), // March 7, 2025, 14:00
        end: new Date(2025, 2, 7, 15, 0), // March 7, 2025, 15:00
        description: "Define the problem or question that needs to be solved, and gather relevant information.",
        type: "event",
      },
      {
        id: "2",
        title: "Brainstorm with the team",
        start: new Date(2025, 2, 7, 14, 0), // March 7, 2025, 14:00
        end: new Date(2025, 2, 7, 15, 0), // March 7, 2025, 15:00
        description: "Define the problem or question that needs to be solved, and gather relevant information.",
        type: "event",
      },
    ]
  }

  const filterEvents = (events: CombinedEvent[], filter: "today" | "week" | "month") => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999)

    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()))
    endOfWeek.setHours(23, 59, 59, 999)

    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    endOfMonth.setHours(23, 59, 59, 999)

    let filtered: CombinedEvent[]

    switch (filter) {
      case "today":
        filtered = events.filter((event) => {
          if (event.type === "event") {
            const eventDate = new Date(event.start)
            return eventDate >= today && eventDate <= endOfToday
          } else {
            // For alarms, we'll show all of them in all filters for now
            return true
          }
        })
        break
      case "week":
        filtered = events.filter((event) => {
          if (event.type === "event") {
            const eventDate = new Date(event.start)
            return eventDate >= today && eventDate <= endOfWeek
          } else {
            return true
          }
        })
        break
      case "month":
        filtered = events.filter((event) => {
          if (event.type === "event") {
            const eventDate = new Date(event.start)
            return eventDate >= today && eventDate <= endOfMonth
          } else {
            return true
          }
        })
        break
      default:
        filtered = events
    }

    // Apply search filter if there's a query
    if (searchQuery) {
      filtered = filtered.filter((event) => {
        if (event.type === "event") {
          return (
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        } else {
          return event.label.toLowerCase().includes(searchQuery.toLowerCase())
        }
      })
    }

    setFilteredEvents(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterEvents(allEvents, activeFilter)
  }

  const handleFilterChange = (filter: "today" | "week" | "month") => {
    setActiveFilter(filter)
    filterEvents(allEvents, filter)
  }

  const formatEventTime = (event: EventType) => {
    const start = new Date(event.start)
    const end = event.end ? new Date(event.end) : undefined

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    }

    if (end) {
      return `${formatTime(start)}-${formatTime(end)}`
    }
    return formatTime(start)
  }

  const formatEventDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "long", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  const toggleAlarm = (id: string) => {
    const updatedEvents = allEvents.map((event) => {
      if (event.type === "alarm" && event.id === id) {
        return { ...event, isActive: !event.isActive }
      }
      return event
    })
    setAllEvents(updatedEvents)
    filterEvents(updatedEvents, activeFilter)

    // Update in localStorage
    const alarms = getAlarms()
    const updatedAlarms = alarms.map((alarm) => (alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm))
    localStorage.setItem("alarms", JSON.stringify(updatedAlarms))
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-2">All Events</h1>

        {!isOnline && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4">
            <p className="text-xs text-yellow-700">
              You&apos;re currently offline. Events are loaded from local storage.
            </p>
          </div>
        )}

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search"
            className="pl-10 border-gray-300 rounded-full"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <Button
            variant={activeFilter === "today" ? "default" : "outline"}
            className={cn(
              "rounded-md py-2",
              activeFilter === "today" ? "bg-[#4355B9] hover:bg-[#3A4A9F]" : "border-gray-300",
            )}
            onClick={() => handleFilterChange("today")}
          >
            TODAY
          </Button>
          <Button
            variant={activeFilter === "week" ? "default" : "outline-solid"}
            className={cn(
              "rounded-md py-2",
              activeFilter === "week" ? "bg-[#4355B9] hover:bg-[#3A4A9F]" : "border-gray-300",
            )}
            onClick={() => handleFilterChange("week")}
          >
            WEEK
          </Button>
          <Button
            variant={activeFilter === "month" ? "default" : "outline-solid"}
            className={cn(
              "rounded-md py-2",
              activeFilter === "month" ? "bg-[#4355B9] hover:bg-[#3A4A9F]" : "border-gray-300",
            )}
            onClick={() => handleFilterChange("month")}
          >
            MONTH
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4355B9]"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No events found</div>
        ) : (
          <div className="space-y-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="relative">
                {event.type === "event" ? (
                  <div className="flex">
                    <div className="flex flex-col items-center mr-3">
                      <Circle className="h-4 w-4 text-[#4355B9] fill-[#4355B9]" />
                      <div className="h-full w-0.5 bg-gray-200 mt-1"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="text-gray-500">{formatEventTime(event)}</div>
                        <div className="text-gray-500">{formatEventDate(event.start)}</div>
                        <div className="text-gray-500">{event.location}</div>
                        <button>
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                      <h3 className="text-lg font-medium mt-1">{event.title}</h3>
                      {event.description && (
                        <div>
                          <p className="text-gray-500 mt-1 line-clamp-1">{event.description}</p>
                          <button className="text-[#4355B9] text-sm mt-1">View more</button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 border-t pt-6">
                    <div className="text-gray-600 mb-1">{event.label}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-light text-gray-700">
                        {event.time.split(" ")[0]} <span className="text-xl">AM</span>
                      </div>
                      <div className="text-[#4355B9]">{event.days[0]}</div>
                      <Switch checked={event.isActive} onCheckedChange={() => toggleAlarm(event.id)} />
                    </div>
                    <div className="mt-2 inline-flex items-center bg-gray-100 px-4 py-2 rounded-full">
                      <Circle className="h-4 w-4 text-[#4355B9] fill-[#4355B9] mr-2" />
                      <span className="text-gray-700">Sleep</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
