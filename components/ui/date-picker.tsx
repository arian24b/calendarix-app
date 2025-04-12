"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function DatePicker() {
  const [selectedDate, setSelectedDate] = React.useState(15)
  const [selectedMonth, setSelectedMonth] = React.useState("July")
  const [selectedYear, setSelectedYear] = React.useState(2023)

  // Generate days for the calendar
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <div className="p-4 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate" />
          </button>
          <h2 className="text-lg font-bold">
            {selectedMonth} {selectedYear}
          </h2>
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
            onClick={() => setSelectedDate(day)}
            className={`h-9 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer
              ${
                day === selectedDate
                  ? "bg-primary text-white"
                  : day === selectedDate + 5
                    ? "border-2 border-primary text-primary"
                    : "hover:bg-muted"
              }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="w-full bg-primary text-white font-medium py-3 rounded-xl">Confirm Date</button>
      </div>
    </div>
  )
}
