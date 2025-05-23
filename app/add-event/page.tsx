"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, X, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createEvent } from "@/lib/services/calendar-service"
import { toast } from "sonner"

export default function AddEventPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category") || ""
  const categoryName = searchParams.get("name") || "Event"

  const [eventName, setEventName] = useState("")
  const [eventNote, setEventNote] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [remindsMe, setRemindsMe] = useState(false)

  const handleCreateEvent = async () => {
    if (!eventName) {
      toast.error("Event name is required")
      return
    }

    try {
      // Format the date and time for the API
      const startDate = eventDate && startTime ? new Date(`${eventDate}T${startTime}`) : new Date()
      const endDate =
        eventDate && endTime ? new Date(`${eventDate}T${endTime}`) : new Date(startDate.getTime() + 3600000)

      // Check if user is authenticated
      const token = localStorage.getItem("token")

      if (token) {
        // Get the first calendar
        const calendars = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/calendars/`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json())

        if (calendars && calendars.length > 0) {
          const calendarId = calendars[0].id

          // Create event via API
          await createEvent(calendarId, {
            title: eventName,
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
          })
        } else {
          // Save to local storage if no calendars
          saveToLocalStorage()
        }
      } else {
        // Save to local storage if not authenticated
        saveToLocalStorage()
      }

      toast.success("Event created successfully")
      router.back()
    } catch (error) {
      console.error("Error creating event:", error)
      toast.error("Failed to create event")
    }
  }

  const saveToLocalStorage = () => {
    const startDate = eventDate && startTime ? new Date(`${eventDate}T${startTime}`) : new Date()
    const endDate = eventDate && endTime ? new Date(`${eventDate}T${endTime}`) : new Date(startDate.getTime() + 3600000)

    const newEvent = {
      id: Date.now().toString(),
      title: eventName,
      start: startDate,
      end: endDate,
      description: eventNote,
      categoryId,
      categoryName,
    }

    // Get existing events
    const existingEvents = localStorage.getItem("localEvents")
    const events = existingEvents ? JSON.parse(existingEvents) : []

    // Add new event
    events.push(newEvent)

    // Save back to localStorage
    localStorage.setItem("localEvents", JSON.stringify(events))
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="p-4">
        <div className="bg-[#A8E6E2] rounded-lg p-6 mb-4 relative">
          <button
            className="bg-white/30 w-8 h-8 rounded-full flex items-center justify-center absolute left-4 top-4"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-medium text-center">{categoryName}</h1>
          <button
            className="bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center absolute right-4 top-4"
            onClick={() => router.back()}
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">Add New Event</h2>
        </div>

        <div className="space-y-4">
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
              className="min-h-[100px] border-gray-300"
            />
          </div>

          <div className="relative">
            <Input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="border-gray-300 pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
        </div>
      </div>

      <div className="mt-auto p-4">
        <Button className="w-full bg-[#5C6BC0] hover:bg-[#4a5ab0] py-6" onClick={handleCreateEvent}>
          CREATE EVENT
        </Button>
      </div>
    </div>
  )
}
