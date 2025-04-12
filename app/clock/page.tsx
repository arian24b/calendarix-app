"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Calendar, Plus } from "lucide-react"
import { BottomNavigation } from "@/components/ui/bottom-navigation"

export default function ClockPage() {
  const [time, setTime] = useState(new Date())
  const [selectedHour, setSelectedHour] = useState(6)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM")
  const [alarmName, setAlarmName] = useState("")
  const [selectedDays, setSelectedDays] = useState<number[]>([1]) // Monday selected by default
  const [alarmTags, setAlarmTags] = useState<string[]>(["Sleep"])

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleAddTag = () => {
    // In a real app, you would show a modal or input to add a new tag
    setAlarmTags([...alarmTags, "New Tag"])
  }

  const handleHourChange = (hour: number) => {
    setSelectedHour(hour)
  }

  const handleMinuteChange = (minute: number) => {
    setSelectedMinute(minute)
  }

  const handlePeriodChange = (period: "AM" | "PM") => {
    setSelectedPeriod(period)
  }

  const handleDayToggle = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((day) => day !== dayIndex))
    } else {
      setSelectedDays([...selectedDays, dayIndex])
    }
  }

  const handleSaveAlarm = () => {
    // In a real app, you would save the alarm to your database
    console.log("Saving alarm:", {
      time: `${selectedHour}:${selectedMinute.toString().padStart(2, "0")} ${selectedPeriod}`,
      name: alarmName,
      days: selectedDays,
      tags: alarmTags,
    })
    // Navigate back to the alarms list
  }

  // Generate previous, current, and next hours for the time picker
  const prevHour = selectedHour === 1 ? 12 : selectedHour - 1
  const nextHour = selectedHour === 12 ? 1 : selectedHour + 1

  // Generate previous, current, and next minutes for the time picker
  const prevMinute = selectedMinute === 0 ? 59 : selectedMinute - 1
  const nextMinute = selectedMinute === 59 ? 0 : selectedMinute + 1

  return (
    <main className="flex min-h-screen flex-col bg-[#fffdf8]">
      <div className="flex-1 p-6 pb-20">
        {/* Back Button */}
        <Link href="/clock/alarms" className="inline-block mb-8">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#d7dfee]">
            <ChevronLeft className="w-6 h-6 text-[#8291ae]" />
          </div>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl text-[#656565] font-medium">Good Morning</h2>
            <span className="text-3xl">☀️</span>
          </div>
          <h1 className="text-4xl font-bold text-[#262626]">Set Your Alarm</h1>
          <p className="text-[#656565] mt-2">Let's build your habits</p>
        </div>

        {/* Time Picker */}
        <div className="flex justify-center items-center mb-10">
          <div className="flex items-center">
            {/* Hour */}
            <div className="flex flex-col items-center w-24">
              <div className="text-4xl text-[#8291ae] opacity-50">{prevHour}</div>
              <div className="text-7xl font-bold my-2">{selectedHour}</div>
              <div className="text-4xl text-[#8291ae] opacity-50">{nextHour}</div>
            </div>

            {/* Colon */}
            <div className="text-6xl font-bold mx-2">:</div>

            {/* Minute */}
            <div className="flex flex-col items-center w-24">
              <div className="text-4xl text-[#8291ae] opacity-50">{prevMinute.toString().padStart(2, "0")}</div>
              <div className="text-7xl font-bold my-2">{selectedMinute.toString().padStart(2, "0")}</div>
              <div className="text-4xl text-[#8291ae] opacity-50">{nextMinute.toString().padStart(2, "0")}</div>
            </div>

            {/* AM/PM */}
            <div className="text-6xl font-bold ml-4">{selectedPeriod}</div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg text-[#262626]">Tomorrow-Thu,Sep 2</div>
          <button className="text-[#8291ae]">
            <Calendar className="w-6 h-6" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="flex justify-between mb-6">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg 
                ${selectedDays.includes(index) ? "bg-[#414ba4] text-white" : "text-[#8291ae]"}`}
              onClick={() => handleDayToggle(index)}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Alarm Name Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Alarm Name"
            className="w-full p-4 border border-[#d7dfee] rounded-xl text-lg text-[#8291ae] focus:outline-none focus:ring-2 focus:ring-[#414ba4]"
            value={alarmName}
            onChange={(e) => setAlarmName(e.target.value)}
          />
        </div>

        {/* Alarm Tags */}
        <div className="flex flex-wrap gap-3 mb-10">
          {alarmTags.map((tag, index) => (
            <div key={index} className="px-4 py-2 bg-[#f1f5f9] rounded-xl flex items-center gap-2 text-[#414ba4]">
              <div className="w-4 h-4 rounded-full bg-[#414ba4]"></div>
              <span>{tag}</span>
            </div>
          ))}
          <button onClick={handleAddTag} className="px-4 py-2 rounded-xl flex items-center gap-2 text-[#414ba4]">
            <Plus className="w-4 h-4" />
            <span>Add new</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            className="w-[48%] py-4 text-center text-lg text-[#8291ae] font-medium"
            onClick={() => window.history.back()}
          >
            CANCEL
          </button>
          <button className="w-[48%] py-4 text-center text-lg text-[#414ba4] font-medium" onClick={handleSaveAlarm}>
            SAVE
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  )
}
