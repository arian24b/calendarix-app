"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Clock, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { saveAlarm, type Alarm } from "@/lib/services/alarm-service"

const DAYS_OF_WEEK = [
  { id: "monday", label: "Mon" },
  { id: "tuesday", label: "Tue" },
  { id: "wednesday", label: "Wed" },
  { id: "thursday", label: "Thu" },
  { id: "friday", label: "Fri" },
  { id: "saturday", label: "Sat" },
  { id: "sunday", label: "Sun" },
]

const ALARM_SOUNDS = [
  { id: "default", label: "Default" },
  { id: "gentle", label: "Gentle" },
  { id: "loud", label: "Loud" },
  { id: "nature", label: "Nature" },
]

export default function CreateAlarmPage() {
  const router = useRouter()
  const [time, setTime] = useState("06:00")
  const [label, setLabel] = useState("")
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isActive, setIsActive] = useState(true)
  const [sound, setSound] = useState("default")
  const [vibrate, setVibrate] = useState(true)
  const [snooze, setSnooze] = useState(true)
  const [saving, setSaving] = useState(false)

  const toggleDay = (dayId: string) => {
    setSelectedDays((prev) => (prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]))
  }

  const handleSave = async () => {
    if (!time) {
      toast.error("Please set a time for the alarm")
      return
    }

    try {
      setSaving(true)

      const newAlarm: Alarm = {
        id: Date.now().toString(),
        time: time,
        label: label || "Alarm",
        isActive: isActive,
        days: selectedDays.length > 0 ? selectedDays : ["daily"],
      }

      saveAlarm(newAlarm)
      toast.success("Alarm created successfully")
      router.push("/alarms")
    } catch (error) {
      console.error("Error creating alarm:", error)
      toast.error("Failed to create alarm")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="p-4 flex items-center border-b">
        <button onClick={() => router.back()} className="mr-4">
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-medium flex-1 text-center">New Alarm</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* Time Picker */}
        <div className="text-center py-8">
          <div className="relative inline-block">
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-6xl font-light text-center border-none bg-transparent text-gray-800 w-auto"
              style={{ fontSize: "4rem", lineHeight: "1" }}
            />
            <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-8 w-8" />
          </div>
        </div>

        {/* Label */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Label</Label>
          <Input
            placeholder="Alarm label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="border-gray-300"
          />
        </div>

        {/* Repeat Days */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Repeat</Label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.id}
                onClick={() => toggleDay(day.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedDays.includes(day.id)
                    ? "bg-[#4355B9] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
          {selectedDays.length === 0 && (
            <p className="text-xs text-gray-500 mt-2">No days selected - alarm will be one-time only</p>
          )}
        </div>

        {/* Sound */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Sound</Label>
          <Select value={sound} onValueChange={setSound}>
            <SelectTrigger className="border-gray-300">
              <div className="flex items-center">
                <Volume2 className="h-4 w-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Select sound" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {ALARM_SOUNDS.map((soundOption) => (
                <SelectItem key={soundOption.id} value={soundOption.id}>
                  {soundOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="vibrate" className="text-sm font-medium text-gray-700">
              Vibrate
            </Label>
            <Switch id="vibrate" checked={vibrate} onCheckedChange={setVibrate} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="snooze" className="text-sm font-medium text-gray-700">
              Snooze
            </Label>
            <Switch id="snooze" checked={snooze} onCheckedChange={setSnooze} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active" className="text-sm font-medium text-gray-700">
              Active
            </Label>
            <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4">
        <Button className="w-full bg-[#4355B9] hover:bg-[#3A4A9F] py-6" onClick={handleSave} disabled={saving}>
          {saving ? "SAVING..." : "SAVE ALARM"}
        </Button>
      </div>
    </div>
  )
}
