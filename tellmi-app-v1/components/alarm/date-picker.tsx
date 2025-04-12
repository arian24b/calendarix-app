"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerProps {
  value: Date
  onChange: (date: Date) => void
  onSelectMonth?: () => void
}

export function DatePicker({ value, onChange, onSelectMonth }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState(value.getMonth())
  const [currentYear, setCurrentYear] = React.useState(value.getFullYear())

  const months = [
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

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

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

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day)
    onChange(newDate)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        day === value.getDate() && currentMonth === value.getMonth() && currentYear === value.getFullYear()

      const isToday =
        day === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear()

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`h-9 w-9 flex items-center justify-center rounded-full text-sm font-medium
            ${isSelected ? "bg-primary text-white" : ""}
            ${isToday && !isSelected ? "border-2 border-primary text-primary" : ""}
            ${!isSelected && !isToday ? "hover:bg-[#f1f5f9]" : ""}
            ${day === 1 ? "bg-primary text-white" : ""}`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  return (
    <div className="p-4 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onSelectMonth} className="flex items-center gap-1 text-lg font-bold">
          {months[currentMonth]} <span className="text-xs">▼</span>
          <span className="text-sm text-[#8291ae] ml-1">{currentYear}</span>
        </button>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-[#8291ae]" />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-[#8291ae]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-[#8291ae]">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  )
}

