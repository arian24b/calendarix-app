"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Calendar, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createEvent, getCalendars } from "@/lib/services/calendar-service"

export default function TestEventPage() {
  const router = useRouter()
  const [title, setTitle] = useState("Test Event")
  const [description, setDescription] = useState("This is a test event to verify calendar functionality")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [startTime, setStartTime] = useState("10:00")
  const [endTime, setEndTime] = useState("11:00")
  const [creating, setCreating] = useState(false)

  const handleCreateTestEvent = async () => {
    try {
      setCreating(true)

      // Get calendars first
      const calendars = await getCalendars()
      if (calendars.length === 0) {
        toast.error("No calendar found. Please create a calendar first.")
        return
      }

      const calendarId = calendars[0].id
      const startDateTime = new Date(`${date}T${startTime}:00`)
      const endDateTime = new Date(`${date}T${endTime}:00`)

      const eventData = {
        title,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        description,
      }

      await createEvent(calendarId, eventData)
      toast.success("Test event created successfully!")
      router.push("/calendar")
    } catch (error) {
      console.error("Error creating test event:", error)
      toast.error("Failed to create test event")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="p-4 flex items-center border-b">
        <button onClick={() => router.back()} className="mr-4">
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-medium flex-1 text-center">Create Test Event</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* Title */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Event Title</Label>
          <div className="relative">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-gray-300 pl-10"
              placeholder="Enter event title"
            />
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Description */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-gray-300 min-h-[80px]"
            placeholder="Enter event description"
          />
        </div>

        {/* Date */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Date</Label>
          <div className="relative">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-gray-300 pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Start Time</Label>
            <div className="relative">
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border-gray-300 pl-10"
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">End Time</Label>
            <div className="relative">
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border-gray-300 pl-10"
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Test Event Information</h3>
          <p className="text-sm text-blue-700">
            This will create a test event to verify that your calendar integration is working properly. The event will
            be saved to your default calendar and should appear in the calendar view.
          </p>
        </div>
      </div>

      {/* Create Button */}
      <div className="p-4">
        <Button
          className="w-full bg-[#4355B9] hover:bg-[#3A4A9F] py-6"
          onClick={handleCreateTestEvent}
          disabled={creating || !title || !date || !startTime || !endTime}
        >
          {creating ? "CREATING..." : "CREATE TEST EVENT"}
        </Button>
      </div>
    </div>
  )
}
