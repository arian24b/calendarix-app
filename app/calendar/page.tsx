"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Plus, X, CalendarIcon, Clock } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { BottomNav } from "@/components/bottom-nav"
import { toast } from "sonner"
import {
  getCalendars,
  getEvents,
  createEvent,
  formatEventForAPI,
  formatEventFromAPI,
  createCalendar,
} from "@/lib/api-services"

interface CalendarDay {
  day: number
  month: "prev" | "current" | "next"
  events: Array<{ color: string; count: number }>
}

interface Event {
  id: string
  title: string
  start: Date
  end?: Date
  description?: string
  location?: string
  color?: string
}

export default function CalendarPage() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [eventName, setEventName] = useState("")
  const [eventNote, setEventNote] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [remindsMe, setRemindsMe] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [calendarId, setCalendarId] = useState<string | null>(null)
  const [calendarDays, setCalendarDays] = useState<CalendarDay[][]>([])

  // Generate month data
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const month = currentMonth.getMonth()
  const year = currentMonth.getFullYear()
  const monthName = monthNames[month]

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // Fetch calendars and events
    const fetchCalendarData = async () => {
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
          // No calendars found, create one
          const newCalendar = await createCalendar({
            name: "My Calendar",
            provider: "app",
          })
          setCalendarId(newCalendar.id)
          setEvents([])
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error)
        toast.error("Failed to load calendar data")
        // Fall back to empty events
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCalendarData()
  }, [router])

  useEffect(() => {
    // Generate calendar days when month changes or events are loaded
    generateCalendarDays()
  }, [currentMonth, events])

  const generateCalendarDays = () => {
    // Get first day of month and adjust for Monday start (0 = Monday, 6 = Sunday)
    const firstDay = new Date(year, month, 1).getDay()
    const firstDayIndex = firstDay === 0 ? 6 : firstDay - 1

    // Get number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Get days from previous month
    const prevMonthDays = new Date(year, month, 0).getDate()

    // Calculate days for calendar grid
    const days: CalendarDay[] = []

    // Previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: "prev",
        events: [],
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      // Get events for this day
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.start)
        return eventDate.getDate() === i && eventDate.getMonth() === month && eventDate.getFullYear() === year
      })

      // Group events by color
      const blueEvents = dayEvents.filter((e) => e.color === "blue" || !e.color)
      const greenEvents = dayEvents.filter((e) => e.color === "green")

      const eventIndicators = []

      if (blueEvents.length > 0) {
        eventIndicators.push({ color: "blue", count: Math.min(blueEvents.length, 3) })
      }

      if (greenEvents.length > 0) {
        eventIndicators.push({ color: "green", count: Math.min(greenEvents.length, 3) })
      }

      days.push({
        day: i,
        month: "current",
        events: eventIndicators,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: "next",
        events: [],
      })
    }

    // Split into weeks
    const weeks = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    setCalendarDays(weeks)
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const handleDayClick = (day: number, monthType: string) => {
    let selectedDate: Date

    if (monthType === "prev") {
      selectedDate = new Date(year, month - 1, day)
    } else if (monthType === "next") {
      selectedDate = new Date(year, month + 1, day)
    } else {
      selectedDate = new Date(year, month, day)
    }

    setSelectedDate(selectedDate)

    // Set default times
    const now = new Date()
    setStartTime(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`)

    const endHour = (now.getHours() + 1) % 24
    setEndTime(`${endHour.toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`)

    setShowAddEvent(true)
  }

  const handleCreateEvent = async () => {
    if (!calendarId) {
      toast.error("No calendar available")
      return
    }

    if (!eventName) {
      toast.error("Event name is required")
      return
    }

    if (!selectedDate) {
      toast.error("Please select a date")
      return
    }

    try {
      // Create start and end dates
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)

      const startDate = new Date(selectedDate)
      startDate.setHours(startHour, startMinute, 0)

      const endDate = new Date(selectedDate)
      endDate.setHours(endHour, endMinute, 0)

      const eventData = {
        title: eventName,
        start: startDate,
        end: endDate,
        description: eventNote,
      }

      // Send to API
      const apiEventData = formatEventForAPI(eventData)
      const newEvent = await createEvent(calendarId, apiEventData)

      // Add to local state
      const formattedEvent = formatEventFromAPI(newEvent)
      setEvents([...events, formattedEvent])

      toast.success("Event created successfully")

      // Reset form
      setShowAddEvent(false)
      setEventName("")
      setEventNote("")
      setRemindsMe(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to create event")
    }
  }

  // Get events for selected date
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return []

    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      )
    })
  }

  const selectedDateEvents = getEventsForSelectedDate()

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
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-700">{monthName}</h2>
            <p className="text-sm text-gray-500">{year}</p>
          </div>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {calendarDays.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
              {week.map((day, dayIndex) => {
                // Check if this day is selected
                const isSelected =
                  selectedDate &&
                  ((day.month === "current" &&
                    day.day === selectedDate.getDate() &&
                    month === selectedDate.getMonth() &&
                    year === selectedDate.getFullYear()) ||
                    (day.month === "prev" &&
                      day.day === selectedDate.getDate() &&
                      month - 1 === selectedDate.getMonth() &&
                      year === selectedDate.getFullYear()) ||
                    (day.month === "next" &&
                      day.day === selectedDate.getDate() &&
                      month + 1 === selectedDate.getMonth() &&
                      year === selectedDate.getFullYear()))

                return (
                  <div
                    key={dayIndex}
                    className={`h-12 flex flex-col items-center justify-start p-1 rounded-md cursor-pointer ${
                      day.month === "current"
                        ? isSelected
                          ? "bg-indigo-600 text-white"
                          : "text-gray-700"
                        : "text-gray-400"
                    }`}
                    onClick={() => handleDayClick(day.day, day.month)}
                  >
                    <span className="text-sm">{day.day}</span>
                    {day.events.length > 0 && (
                      <div className="flex mt-auto space-x-0.5">
                        {day.events.map((eventGroup, i) => (
                          <div key={i} className="flex space-x-0.5">
                            {Array(eventGroup.count)
                              .fill(0)
                              .map((_, j) => (
                                <div
                                  key={j}
                                  className={`w-1 h-1 rounded-full ${
                                    eventGroup.color === "blue" ? "bg-blue-500" : "bg-green-500"
                                  }`}
                                />
                              ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="mt-6">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <div key={event.id} className="mb-4 relative group">
                <div className="flex items-start">
                  <div
                    className={`mt-1 mr-3 w-2 h-2 rounded-full ${event.color === "green" ? "bg-green-500" : "bg-blue-500"}`}
                  />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">
                      {`${event.start.getHours().toString().padStart(2, "0")}:${event.start.getMinutes().toString().padStart(2, "0")}`}
                      {event.end &&
                        `-${event.end.getHours().toString().padStart(2, "0")}:${event.end.getMinutes().toString().padStart(2, "0")}`}
                    </div>
                    <h3 className="font-medium">{event.title}</h3>
                    {event.description && <p className="text-sm text-gray-500">{event.description}</p>}
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : selectedDate ? (
            <div className="text-center py-8 text-gray-500">No events for {selectedDate.toLocaleDateString()}</div>
          ) : (
            <div className="text-center py-8 text-gray-500">Select a date to view events</div>
          )}
        </div>
      </div>

      <div className="fixed bottom-16 right-4">
        <button
          className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
          onClick={() => {
            setSelectedDate(new Date())
            setEventName("")
            setEventNote("")
            setShowAddEvent(true)
          }}
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      </div>

      <BottomNav currentPath="/calendar" />

      {/* Add New Event Sheet */}
      <Sheet open={showAddEvent} onOpenChange={setShowAddEvent}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
          <SheetHeader className="relative">
            <SheetTitle className="text-center">Add New Event</SheetTitle>
            <SheetClose className="absolute right-0 top-0 rounded-full bg-gray-100 p-1">
              <X className="h-4 w-4" />
            </SheetClose>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div>
              <Input
                placeholder="Event name*"
                className="border-gray-300"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>

            <div>
              <Input
                placeholder="Type the note here..."
                className="border-gray-300"
                value={eventNote}
                onChange={(e) => setEventNote(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-md p-3">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Select date"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-md p-3">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="time"
                    className="bg-transparent focus:outline-none text-gray-700 w-full"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-md p-3">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="time"
                    className="bg-transparent focus:outline-none text-gray-700 w-full"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Reminds me</span>
              <Switch checked={remindsMe} onCheckedChange={setRemindsMe} />
            </div>

            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreateEvent}>
              CREATE EVENT
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
