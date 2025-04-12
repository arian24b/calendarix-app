"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Calendar() {
  // Generate days for the calendar
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const today = 15 // Assuming today is the 15th

  return (
    <div className="p-4 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">July 2023</h2>
        <div className="flex space-x-2">
          <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate" />
          </button>
          <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-slate" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-slate">
            {day}
          </div>
        ))}

        {/* Empty cells for days before the 1st */}
        {Array.from({ length: 5 }, (_, i) => (
          <div key={`empty-${i}`} className="h-9"></div>
        ))}

        {days.map((day) => (
          <div
            key={day}
            className={`h-9 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer
              ${day === today ? "bg-primary text-white" : "hover:bg-muted"}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}
