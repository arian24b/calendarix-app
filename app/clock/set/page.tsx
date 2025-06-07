"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { ScrollableTimePicker } from "@/components/scrollable-time-picker"

export default function SetAlarmPage() {
  const router = useRouter()
  const [selectedTime, setSelectedTime] = useState({
    hour: 6,
    minute: 0,
    period: "AM" as "AM" | "PM",
  })
  const [selectedDate, setSelectedDate] = useState("Tomorrow-Thu Sep 2")
  const [alarmName, setAlarmName] = useState("Sleep")
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleSave = () => {
    // Save alarm logic here
    console.log("Saving alarm:", { selectedTime, selectedDate, alarmName })
    router.back()
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b">
        <button onClick={handleCancel}>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-600">←</span>
          </div>
        </button>
        <div className="text-center">
          <div className="text-sm text-gray-500">Good Morning 👋</div>
          <div className="font-medium text-gray-900">Set Your Alarm</div>
          <div className="text-xs text-gray-400">Let&apos;s build your habits</div>
        </div>
        <div className="w-8"></div>
      </div>

      {/* Time Picker */}
      <div className="px-4 py-8">
        <ScrollableTimePicker value={selectedTime} onChange={setSelectedTime} />
      </div>

      {/* Date Selection */}
      <div className="px-4 mt-6">
        <button
          onClick={() => setShowDatePicker(true)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900">{selectedDate}</span>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="px-4 mt-4">
        <div className="flex justify-between">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div
              key={index}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Alarm Name */}
      <div className="px-4 mt-6">
        <div className="text-sm text-gray-600 mb-2">Alarm Name</div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#4355B9] rounded-full"></div>
          <Input
            value={alarmName}
            onChange={(e) => setAlarmName(e.target.value)}
            className="flex-1 border-none bg-transparent text-[#4355B9] font-medium focus:ring-0 p-0"
            placeholder="Enter alarm name"
          />
          <span className="text-sm text-gray-400">+ Add new</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleCancel} className="flex-1 py-3 text-gray-600 border-gray-300">
            CANCEL
          </Button>
          <Button onClick={handleSave} className="flex-1 py-3 bg-[#4355B9] hover:bg-[#3A4A9F] text-white">
            SAVE
          </Button>
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 m-4 w-full max-w-sm">
            <div className="text-center mb-4">
              <div className="text-lg font-medium">Select Date</div>
            </div>

            {/* Month/Year Picker */}
            <div className="space-y-2 mb-6">
              <div className="text-center text-gray-400 text-sm">AUG 01</div>
              <div className="text-center text-xl font-medium">SEP 02 2025</div>
              <div className="text-center text-gray-400 text-sm">OCT 03</div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowDatePicker(false)} className="flex-1">
                CANCEL
              </Button>
              <Button
                onClick={() => {
                  setSelectedDate("Tomorrow-Thu Sep 2")
                  setShowDatePicker(false)
                }}
                className="flex-1 bg-[#4355B9] hover:bg-[#3A4A9F] text-white"
              >
                DONE
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
