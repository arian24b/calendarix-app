"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Calendar, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"
import { saveAlarm, type Alarm } from "@/lib/services/alarm-service"
import { toast } from "sonner"

export default function SetAlarmPage() {
  const router = useRouter()
  const [selectedHour, setSelectedHour] = useState(6)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const [selectedAmPm, setSelectedAmPm] = useState("AM")
  const [selectedDate, setSelectedDate] = useState("Tomorrow-Thu,Sep 2")
  const [alarmName, setAlarmName] = useState("")
  const [isSleepSelected, setIsSleepSelected] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const incrementHour = () => {
    setSelectedHour((prev) => (prev === 12 ? 1 : prev + 1))
  }

  const decrementHour = () => {
    setSelectedHour((prev) => (prev === 1 ? 12 : prev - 1))
  }

  const incrementMinute = () => {
    setSelectedMinute((prev) => (prev === 59 ? 0 : prev + 1))
  }

  const decrementMinute = () => {
    setSelectedMinute((prev) => (prev === 0 ? 59 : prev - 1))
  }

  const toggleAmPm = () => {
    setSelectedAmPm((prev) => (prev === "AM" ? "PM" : "AM"))
  }

  const handleSaveAlarm = () => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: `${selectedHour} : ${selectedMinute.toString().padStart(2, "0")} ${selectedAmPm}`,
      label: alarmName || "breakfast time!",
      isActive: true,
      days: [selectedDate],
    }

    saveAlarm(newAlarm)
    toast.success("Alarm saved successfully")
    router.push("/clock")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center mb-2">
          <button onClick={() => router.back()} className="mr-4">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center">
            <Sun className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm text-gray-500">Good Morning</span>
          </div>
        </div>
        <h1 className="text-2xl font-semibold">Set Your Alarm</h1>
        <p className="text-sm text-gray-500">Let's build your habits</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Time Picker */}
        <div className="flex items-center justify-center mb-8">
          {/* Hour */}
          <div className="flex flex-col items-center mr-4">
            <button onClick={incrementHour} className="p-2">
              <span className="text-2xl text-gray-400">{selectedHour === 12 ? 1 : selectedHour + 1}</span>
            </button>
            <span className="text-6xl font-light text-gray-700">{selectedHour}</span>
            <button onClick={decrementHour} className="p-2">
              <span className="text-2xl text-gray-400">{selectedHour === 1 ? 12 : selectedHour - 1}</span>
            </button>
          </div>

          <span className="text-6xl font-light text-gray-700 mx-2">:</span>

          {/* Minute */}
          <div className="flex flex-col items-center mx-4">
            <button onClick={incrementMinute} className="p-2">
              <span className="text-2xl text-gray-400">
                {(selectedMinute === 59 ? 0 : selectedMinute + 1).toString().padStart(2, "0")}
              </span>
            </button>
            <span className="text-6xl font-light text-gray-700">{selectedMinute.toString().padStart(2, "0")}</span>
            <button onClick={decrementMinute} className="p-2">
              <span className="text-2xl text-gray-400">
                {(selectedMinute === 0 ? 59 : selectedMinute - 1).toString().padStart(2, "0")}
              </span>
            </button>
          </div>

          {/* AM/PM */}
          <div className="flex flex-col items-center ml-4">
            <button onClick={toggleAmPm} className="p-2">
              <span className="text-2xl text-gray-400">{selectedAmPm === "AM" ? "PM" : "AM"}</span>
            </button>
            <span className="text-6xl font-light text-gray-700">{selectedAmPm}</span>
            <button onClick={toggleAmPm} className="p-2">
              <span className="text-2xl text-gray-400">{selectedAmPm === "AM" ? "PM" : "AM"}</span>
            </button>
          </div>
        </div>

        <div className="w-full max-w-md space-y-4">
          {/* Date Selector */}
          <button
            className="flex items-center justify-between w-full p-3 bg-white rounded-lg border"
            onClick={() => setShowDatePicker(true)}
          >
            <span className="text-gray-700">{selectedDate}</span>
            <Calendar className="h-5 w-5 text-gray-400" />
          </button>

          {/* Alarm Name */}
          <Input
            placeholder="Alarm Name"
            value={alarmName}
            onChange={(e) => setAlarmName(e.target.value)}
            className="bg-white"
          />

          {/* Sleep Toggle */}
          <div className="flex items-center space-x-3">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                isSleepSelected ? "bg-[#4355B9] border-[#4355B9]" : "border-gray-300"
              }`}
              onClick={() => setIsSleepSelected(!isSleepSelected)}
            >
              {isSleepSelected && <span className="text-white text-xs">✓</span>}
            </div>
            <span className="text-gray-700">Sleep</span>
            <button className="text-[#4355B9] text-sm">+ Add new</button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" className="px-8" onClick={() => router.back()}>
              CANCEL
            </Button>
            <Button className="px-8 bg-[#4355B9] hover:bg-[#3A4A9F]" onClick={handleSaveAlarm}>
              SAVE
            </Button>
          </div>
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-sm mx-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Select Date</h3>
            </div>
            <div className="space-y-2">
              {["Tomorrow-Thu,Sep 2", "Friday-Fri,Sep 3", "Saturday-Sat,Sep 4"].map((date) => (
                <button
                  key={date}
                  className={`w-full p-3 text-left rounded-lg ${
                    selectedDate === date ? "bg-[#4355B9] text-white" : "bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedDate(date)
                    setShowDatePicker(false)
                  }}
                >
                  {date}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setShowDatePicker(false)}>
                CANCEL
              </Button>
              <Button className="bg-[#4355B9] hover:bg-[#3A4A9F]" onClick={() => setShowDatePicker(false)}>
                DONE
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav currentPath="/clock" />
    </div>
  )
}
