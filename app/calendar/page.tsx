"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal, CalendarIcon, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { BottomNav } from "@/components/bottom-nav"
import {
  getCalendars,
  createCalendar,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  LocalEvent
} from "@/lib/services/calendar-service"
import { formatEventFromAPI } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end?: Date
  description?: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [calendarId, setCalendarId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  )

  // Form state
  const [eventName, setEventName] = useState("")
  const [eventNote, setEventNote] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [remindsMe, setRemindsMe] = useState(false)

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

  // Fetch data when component mounts
  useEffect(() => {
    fetchCalendarData()
  }, [])

  // Refetch when coming back online
  useEffect(() => {
    if (isOnline && calendarId) {
      fetchCalendarData()
    }
  }, [isOnline, calendarId])

  const fetchCalendarData = async () => {
    try {
      setIsLoading(true)

      // Get calendars
      const calendars = await getCalendars()

      if (calendars.length > 0) {
        const defaultCalendar = calendars[0]
        setCalendarId(defaultCalendar.id)

        // Get events for this calendar
        const apiEvents = await getEvents(defaultCalendar.id)

        if (apiEvents && Array.isArray(apiEvents)) {
          const formattedEvents = apiEvents.map(formatEventFromAPI)
          setEvents(formattedEvents)
        } else {
          console.error("Invalid API response format for events")
          setEvents([])
        }
      } else {
        // Create a new calendar if none exists
        const newCalendar = await createCalendar({
          name: "My Calendar",
          provider: "app",
        })
        setCalendarId(newCalendar.id)
        setEvents([])
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error)

      // Fallback to local storage in case of error
      const savedEvents = localStorage.getItem("localEvents")
      if (savedEvents) {
        try {
          const parsedEvents = JSON.parse(savedEvents).map((event: LocalEvent) => ({
            ...event,
            start: new Date(event.start),
            end: event.end ? new Date(event.end) : undefined,
          }))
          setEvents(parsedEvents)
        } catch {
          setEvents([])
        }
      } else {
        setEvents([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)

    const days = []

    // Previous month days
    const prevMonth = new Date(year, month - 1, 0)
    const daysInPrevMonth = prevMonth.getDate()
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, daysInPrevMonth - i),
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day),
      })
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleCreateEvent = async () => {
    if (!eventName) {
      toast.error("Event name is required")
      return
    }

    try {
      const startDate = eventDate && startTime ? new Date(`${eventDate}T${startTime}`) : new Date()
      const endDate =
        eventDate && endTime ? new Date(`${eventDate}T${endTime}`) : new Date(startDate.getTime() + 3600000)

      const eventData = {
        title: eventName,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        description: eventNote,
      }

      if (calendarId) {
        if (editingEvent) {
          // Update existing event
          const updatedEvent = await updateEvent(editingEvent.id, calendarId, eventData)
          const formattedEvent = formatEventFromAPI(updatedEvent)

          // Update local state
          setEvents(prev => prev.map(event =>
            event.id === editingEvent.id ? formattedEvent : event
          ))

          toast.success("Event updated successfully")
        } else {
          // Create new event
          const newEvent = await createEvent(calendarId, eventData)
          const formattedEvent = formatEventFromAPI(newEvent)

          // Add to local state
          setEvents(prev => [...prev, formattedEvent])

          toast.success("Event created successfully")
        }
      } else {
        toast.error("No calendar found")
      }

      resetForm()
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to process event"
      toast.error(errorMsg)
      console.error("Event handling error:", error)
    }
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setEventName(event.title)
    setEventNote(event.description || "")
    setEventDate(event.start.toISOString().split("T")[0])
    setStartTime(event.start.toTimeString().slice(0, 5))
    setEndTime(event.end ? event.end.toTimeString().slice(0, 5) : "")
    setShowAddEvent(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId)
      setEvents(prev => prev.filter(event => event.id !== eventId))
      toast.success("Event deleted successfully")
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Failed to delete event")
    }
  }

  const resetForm = () => {
    setShowAddEvent(false)
    setEditingEvent(null)
    setEventName("")
    setEventNote("")
    setEventDate("")
    setStartTime("")
    setEndTime("")
    setRemindsMe(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
  }

  const formatTimeRange = (start: Date, end?: Date) => {
    if (end) {
      return `${formatTime(start)}-${formatTime(end)}`
    }
    return formatTime(start)
  }

  const calendarDays = generateCalendarDays()
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

  const todayEvents = events.filter((event) => {
    const today = new Date()
    const eventDate = new Date(event.start)
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    )
  })

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      {/* Network Status Indicator */}
      {!isOnline && (
        <div className="bg-amber-500 text-white py-1 px-4 text-center text-sm">
          You&apos;re offline. Changes will sync when you reconnect.
        </div>
      )}

      {/* Calendar Header */}
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => navigateMonth("prev")}>
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-medium">{monthNames[currentDate.getMonth()]}</h1>
          <p className="text-sm text-gray-500">{currentDate.getFullYear()}</p>
        </div>
        <button onClick={() => navigateMonth("next")}>
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="px-4 mb-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center text-sm text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDate(day.date)
            const isToday = day.date.toDateString() === new Date().toDateString() && day.isCurrentMonth
            const isSelected = day.day === 2 && day.isCurrentMonth // Highlight day 2 as in the image

            return (
              <div key={index} className="relative h-12 flex flex-col items-center justify-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                    day.isCurrentMonth ? "text-gray-900" : "text-gray-400",
                    isSelected && "bg-[#4355B9] text-white",
                    isToday && !isSelected && "bg-gray-200",
                  )}
                >
                  {day.day}
                </div>
                {dayEvents.length > 0 && (
                  <div className="flex space-x-1 mt-1">
                    {dayEvents.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1 h-1 rounded-full",
                          i === 0 && "bg-green-500",
                          i === 1 && "bg-blue-500",
                          i === 2 && "bg-purple-500",
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Event Button */}
      <div className="px-4 mb-4">
        <button
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-8 flex items-center justify-center"
          onClick={() => setShowAddEvent(true)}
        >
          <Plus className="h-6 w-6 text-gray-400" />
        </button>
      </div>

      {/* Events List */}
      <div className="flex-1 px-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4355B9]"></div>
          </div>
        ) : todayEvents.length > 0 ? (
          <div className="space-y-4">
            {todayEvents.map((event) => (
              <div key={event.id} className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{formatTimeRange(event.start, event.end)}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1">
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditEvent(event)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteEvent(event.id)} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-medium">{event.title}</h3>
                  {event.description && <p className="text-sm text-gray-500 mt-1">{event.description}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No events for today</div>
        )}
      </div>

      {/* Add/Edit Event Sheet */}
      <Sheet open={showAddEvent} onOpenChange={resetForm}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-lg">
          <SheetHeader className="relative">
            <SheetTitle className="text-center">{editingEvent ? "Edit Event" : "Add New Event"}</SheetTitle>
            <button className="absolute right-0 top-0" onClick={resetForm}>
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <div>
              <Input
                placeholder="Event name*"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div>
              <Textarea
                placeholder="Type the note here..."
                value={eventNote}
                onChange={(e) => setEventNote(e.target.value)}
                className="min-h-[80px] border-gray-300"
              />
            </div>

            <div className="relative">
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="border-gray-300 pl-10"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  type="time"
                  placeholder="Start"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border-gray-300 pl-10"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <div className="relative">
                <Input
                  type="time"
                  placeholder="End time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border-gray-300 pl-10"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reminds-me" className="text-gray-700">
                Reminds me
              </Label>
              <Switch id="reminds-me" checked={remindsMe} onCheckedChange={setRemindsMe} />
            </div>

            <Button
              className="w-full bg-[#4355B9] hover:bg-[#3A4A9F] py-6 mt-6"
              onClick={handleCreateEvent}
              disabled={!eventName || !eventDate || !startTime}
            >
              {editingEvent ? "UPDATE EVENT" : "CREATE EVENT"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <BottomNav currentPath="/calendar" />
    </div>
  )
}
