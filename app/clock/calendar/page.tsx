"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

export default function CalendarPickerPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 2)) // September 2, 2025
  const [selectedDate, setSelectedDate] = useState(2)

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
        hasEvents: false,
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        hasEvents: [2, 9, 13, 14, 20, 22, 29, 30].includes(day), // Mock events
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        hasEvents: false,
      })
    }

    return days
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

  const calendarDays = generateCalendarDays()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="text-center">
              <h1 className="text-lg font-medium">{monthNames[currentDate.getMonth()]}</h1>
              <p className="text-sm text-gray-500">{currentDate.getFullYear()}</p>
            </div>
            <button onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="w-6"></div>
        </div>

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
          {calendarDays.map((day, index) => (
            <button
              key={index}
              className={cn(
                "relative h-12 flex flex-col items-center justify-center rounded-lg",
                day.isCurrentMonth ? "text-gray-900" : "text-gray-400",
                selectedDate === day.day && day.isCurrentMonth && "bg-[#4355B9] text-white",
              )}
              onClick={() => day.isCurrentMonth && setSelectedDate(day.day)}
            >
              <span className="text-sm">{day.day}</span>
              {day.hasEvents && (
                <div className="flex space-x-1 mt-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 bg-white border-t">
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            CANCEL
          </Button>
          <Button className="bg-[#4355B9] hover:bg-[#3A4A9F]" onClick={() => router.back()}>
            DONE
          </Button>
        </div>
      </div>

      <BottomNav currentPath="/clock" />
    </div>
  )
}
