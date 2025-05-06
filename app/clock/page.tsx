"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ChevronLeft, CalendarIcon, ChevronDown } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

interface Alarm {
  id: string
  time: string
  label: string
  isActive: boolean
  days: string[]
}

export default function ClockPage() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedHour, setSelectedHour] = useState("6")
  const [selectedMinute, setSelectedMinute] = useState("00")
  const [selectedAmPm, setSelectedAmPm] = useState("AM")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [alarmLabel, setAlarmLabel] = useState("breakfast time!")
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [isSleepSelected, setIsSleepSelected] = useState(true)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Load alarms from localStorage
  useEffect(() => {
    const savedAlarms = localStorage.getItem("alarms")
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms))
    }
  }, [])

  // Save alarms to localStorage
  const saveAlarms = (newAlarms: Alarm[]) => {
    localStorage.setItem("alarms", JSON.stringify(newAlarms))
    setAlarms(newAlarms)
  }

  const handleSaveAlarm = () => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: `${selectedHour}:${selectedMinute} ${selectedAmPm}`,
      label: alarmLabel || "breakfast time!",
      isActive: true,
      days: ["Tomorrow-Thu,Sep 2"],
    }

    saveAlarms([...alarms, newAlarm])
  }

  const toggleAlarm = (id: string) => {
    const updatedAlarms = alarms.map((alarm) => (alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm))
    saveAlarms(updatedAlarms)
  }

  const deleteAlarm = (id: string) => {
    const updatedAlarms = alarms.filter((alarm) => alarm.id !== id)
    saveAlarms(updatedAlarms)
  }

  const incrementHour = () => {
    const hour = Number.parseInt(selectedHour)
    setSelectedHour(((hour % 12) + 1).toString())
  }

  const decrementHour = () => {
    const hour = Number.parseInt(selectedHour)
    setSelectedHour((((hour - 2 + 12) % 12) + 1).toString())
  }

  const incrementMinute = () => {
    const minute = Number.parseInt(selectedMinute)
    setSelectedMinute(((minute + 1) % 60).toString().padStart(2, "0"))
  }

  const decrementMinute = () => {
    const minute = Number.parseInt(selectedMinute)
    setSelectedMinute(((minute - 1 + 60) % 60).toString().padStart(2, "0"))
  }

  const toggleAmPm = () => {
    setSelectedAmPm(selectedAmPm === "AM" ? "PM" : "AM")
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth)

    // Adjust for Sunday as 0
    const firstDayIndex = firstDay === 0 ? 6 : firstDay - 1

    const daysArray = []

    // Previous month days
    const prevMonthDays = getDaysInMonth(selectedYear, selectedMonth - 1)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      daysArray.push({
        day: prevMonthDays - i,
        month: "prev",
        isToday: false,
      })
    }

    // Current month days
    const today = new Date()
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear()

      daysArray.push({
        day: i,
        month: "current",
        isToday,
      })
    }

    // Next month days
    const remainingDays = 42 - daysArray.length
    for (let i = 1; i <= remainingDays; i++) {
      daysArray.push({
        day: i,
        month: "next",
        isToday: false,
      })
    }

    return daysArray
  }

  const calendarDays = generateCalendarDays()
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <button className="p-2" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-lg font-medium flex-1 text-center">Set Your Alarm</h1>
          <div className="w-8"></div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-1">Let's build your habits</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="flex items-center justify-center mb-8">
          <div className="flex flex-col items-center mr-4">
            <button className="text-gray-400" onClick={incrementHour}>
              <span className="text-2xl">5</span>
            </button>
            <span className="text-6xl font-light">{selectedHour}</span>
            <button className="text-gray-400" onClick={decrementHour}>
              <span className="text-2xl">7</span>
            </button>
          </div>

          <span className="text-6xl font-light mx-2">:</span>

          <div className="flex flex-col items-center mx-4">
            <button className="text-gray-400" onClick={incrementMinute}>
              <span className="text-2xl">59</span>
            </button>
            <span className="text-6xl font-light">{selectedMinute}</span>
            <button className="text-gray-400" onClick={decrementMinute}>
              <span className="text-2xl">01</span>
            </button>
          </div>

          <div className="flex flex-col items-center ml-4">
            <button className="text-gray-400" onClick={toggleAmPm}>
              <span className="invisible text-2xl">PM</span>
            </button>
            <span className="text-6xl font-light">{selectedAmPm}</span>
            <button className="text-gray-400" onClick={toggleAmPm}>
              <span className="invisible text-2xl">AM</span>
            </button>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center text-gray-700" onClick={() => setShowDatePicker(true)}>
              <span>Tomorrow-Thu,Sep 2</span>
              <CalendarIcon className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={alarmLabel}
              onChange={(e) => setAlarmLabel(e.target.value)}
              placeholder="Alarm Name"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center mb-6">
            <div
              className={cn(
                "flex items-center justify-center rounded-full w-6 h-6 mr-2",
                isSleepSelected ? "bg-blue-600" : "border border-gray-300",
              )}
              onClick={() => setIsSleepSelected(!isSleepSelected)}
            >
              {isSleepSelected && <span className="text-white text-xs">✓</span>}
            </div>
            <span className="text-gray-700">Sleep</span>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" className="px-8" onClick={() => router.push("/calendar")}>
              CANCEL
            </Button>
            <Button className="px-8 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveAlarm}>
              SAVE
            </Button>
          </div>
        </div>
      </div>

      {/* Date Picker Sheet */}
      <Sheet open={showDatePicker} onOpenChange={setShowDatePicker}>
        <SheetContent side="bottom" className="h-[80vh] p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <button onClick={() => setShowDatePicker(false)}>
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button className="flex items-center text-blue-600" onClick={() => setShowMonthPicker(true)}>
                <span className="font-medium">September</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              <button onClick={() => setShowDatePicker(false)}>
                <span className="text-blue-600">DONE</span>
              </button>
            </div>

            <div className="p-4 flex-1">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <div key={i} className="text-center text-sm text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => (
                  <button
                    key={i}
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center text-sm",
                      day.month === "current"
                        ? day.isToday
                          ? "bg-blue-600 text-white"
                          : "text-gray-700"
                        : "text-gray-400",
                      day.day === 2 && day.month === "current" && "border-2 border-blue-600",
                    )}
                    onClick={() => {
                      // Handle date selection
                      setShowDatePicker(false)
                    }}
                  >
                    {day.day}
                    {day.day === 2 && day.month === "current" && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex">
                        <div className="w-1 h-1 bg-blue-600 rounded-full mx-0.5"></div>
                        <div className="w-1 h-1 bg-blue-600 rounded-full mx-0.5"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Month Picker Sheet */}
      <Sheet open={showMonthPicker} onOpenChange={setShowMonthPicker}>
        <SheetContent side="bottom" className="h-[60vh]">
          <SheetHeader>
            <SheetTitle className="text-center">
              <div className="flex items-center justify-between">
                <button onClick={() => setShowMonthPicker(false)}>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span>2025</span>
                <button onClick={() => setShowMonthPicker(false)}>
                  <span className="text-blue-600">DONE</span>
                </button>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="py-6">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center w-full justify-between px-12">
                <div className="text-4xl text-gray-400">AUG</div>
                <div className="text-4xl">01</div>
              </div>

              <div className="flex items-center w-full justify-between px-12">
                <div className="text-4xl text-blue-600">SEP</div>
                <div className="text-4xl">02</div>
                <div className="text-4xl">2025</div>
              </div>

              <div className="flex items-center w-full justify-between px-12">
                <div className="text-4xl text-gray-400">OCT</div>
                <div className="text-4xl">03</div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <BottomNav currentPath="/clock" />
    </div>
  )
}
