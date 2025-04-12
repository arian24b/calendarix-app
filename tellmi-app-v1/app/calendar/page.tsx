"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, Plus, MoreHorizontal, CalendarIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { Switch } from "@/components/ui/switch"
import { BottomNavigation } from "@/components/ui/bottom-navigation"

interface Event {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  location?: string
  date: Date
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    date: new Date(),
  })
  const [remindMe, setRemindMe] = useState(false)

  // Sample events data
  const events: Event[] = [
    {
      id: "1",
      title: "Design new UX flow for Michael",
      description: "Start from Client 18",
      startTime: "10:00",
      endTime: "13:00",
      date: new Date(2023, 8, 1),
    },
    {
      id: "2",
      title: "Design new UX flow for Michael",
      description: "Define the product experience that...",
      startTime: "14:30",
      endTime: "16:30",
      date: new Date(2023, 8, 1),
    },
    {
      id: "3",
      title: "Workout with Elle",
      description: "Start from room 18",
      startTime: "19:30",
      endTime: "20:00",
      date: new Date(2023, 8, 1),
    },
  ]

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleAddEvent = () => {
    setIsAddEventOpen(true)
  }

  const handleCreateEvent = () => {
    // In a real app, you would save the event to your database
    console.log("Creating event:", newEvent)
    setIsAddEventOpen(false)
    // Reset form
    setNewEvent({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      date: new Date(),
    })
    setRemindMe(false)
  }

  // Generate calendar days
  const generateCalendarDays = () => {
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

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    // Get days from previous month to fill the first row
    const prevMonthDays = []
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

    for (let i = 0; i < firstDayOfMonth; i++) {
      prevMonthDays.push({
        day: daysInPrevMonth - firstDayOfMonth + i + 1,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false,
      })
    }

    // Current month days
    const currentMonthDays = []
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
      })
    }

    // Next month days to fill the last row
    const nextMonthDays = []
    const totalDaysDisplayed = prevMonthDays.length + currentMonthDays.length
    const daysNeeded = Math.ceil(totalDaysDisplayed / 7) * 7 - totalDaysDisplayed

    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear

    for (let i = 1; i <= daysNeeded; i++) {
      nextMonthDays.push({
        day: i,
        month: nextMonth,
        year: nextMonthYear,
        isCurrentMonth: false,
      })
    }

    return {
      monthName: monthNames[currentMonth],
      year: currentYear,
      days: [...prevMonthDays, ...currentMonthDays, ...nextMonthDays],
    }
  }

  const calendar = generateCalendarDays()

  // Check if a date is today
  const isToday = (day: number, month: number, year: number) => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  // Check if a date is selected
  const isSelected = (day: number, month: number, year: number) => {
    return day === 1 && month === 8 && year === 2023
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="flex-1 p-4 pb-20">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center">
              <ChevronLeft className="w-5 h-5 text-[#8291ae]" />
            </button>
            <h2 className="text-lg font-medium mx-2">{calendar.monthName}</h2>
            <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-[#8291ae]" />
            </button>
          </div>
          <div className="text-sm text-[#8291ae]">{calendar.year}</div>
        </div>

        {/* Calendar Grid */}
        <div className="mb-6">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <div key={index} className="text-center text-sm text-[#8291ae]">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendar.days.map((day, index) => (
              <div
                key={index}
                className={`h-10 flex items-center justify-center rounded-full text-sm relative
                  ${!day.isCurrentMonth ? "text-[#ced3de]" : ""}
                  ${isToday(day.day, day.month, day.year) ? "bg-[#414ba4] text-white" : ""}
                  ${isSelected(day.day, day.month, day.year) ? "bg-[#414ba4] text-white" : ""}
                `}
              >
                <span className={`${day.day === 1 && day.isCurrentMonth ? "text-xs" : ""}`}>{day.day}</span>
                {day.day === 1 && day.isCurrentMonth && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#414ba4] rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Event Button */}
        <button
          onClick={handleAddEvent}
          className="w-8 h-8 bg-[#414ba4] rounded-full flex items-center justify-center text-white mb-6 ml-auto"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Events List */}
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex">
              <div className="w-24 text-xs text-[#8291ae]">
                {event.startTime}-{event.endTime}
              </div>
              <div className="flex-1 border-l-2 border-[#414ba4] pl-3">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">{event.title}</h3>
                  <button className="text-[#8291ae]">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#8291ae]">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Add Event Modal */}
      <ActionSheet isOpen={isAddEventOpen} onClose={() => setIsAddEventOpen(false)}>
        <div className="relative">
          <button
            onClick={() => setIsAddEventOpen(false)}
            className="absolute top-0 right-0 w-6 h-6 bg-[#414ba4] rounded-full flex items-center justify-center text-white"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3L3 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 3L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <h2 className="text-lg font-medium mb-6">Add New Event</h2>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Event name*"
                className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4]"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div>
              <textarea
                placeholder="Type the note here..."
                className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4] min-h-[100px]"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              ></textarea>
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Date"
                  className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4] pr-10"
                  value={newEvent.date ? newEvent.date.toLocaleDateString() : ""}
                  readOnly
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8291ae]" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Start time"
                  className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4] pr-10"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8291ae] w-5 h-5" />
              </div>

              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="End time"
                  className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4] pr-10"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8291ae] w-5 h-5" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#48546d]">Reminds me</span>
              <Switch checked={remindMe} onCheckedChange={setRemindMe} />
            </div>

            <button onClick={handleCreateEvent} className="w-full bg-[#414ba4] text-white font-medium py-3 rounded-lg">
              CREATE EVENT
            </button>
          </div>
        </div>
      </ActionSheet>
    </main>
  )
}

