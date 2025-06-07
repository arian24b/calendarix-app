"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, Moon } from "lucide-react"
import Link from "next/link"
import { getAlarms, type Alarm } from "@/lib/services/alarm-service"

export default function ClockPage() {
  const router = useRouter()
  const [smartClockEnabled, setSmartClockEnabled] = useState(false)
  const [alarms, setAlarms] = useState<Alarm[]>([])

  useEffect(() => {
    const loadedAlarms = getAlarms()
    if (loadedAlarms.length === 0) {
      // Set default alarms if none exist
      const defaultAlarms: Alarm[] = [
        {
          id: "1",
          time: "6:00 AM",
          label: "breakfast time!",
          isActive: true,
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
        {
          id: "2",
          time: "8:00 PM",
          label: "bedtime!",
          isActive: true,
          days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        },
        {
          id: "3",
          time: "12:00 PM",
          label: "lunch time!",
          isActive: false,
          days: ["Monday", "Wednesday", "Friday"],
        },
      ]
      localStorage.setItem("alarms", JSON.stringify(defaultAlarms))
      setAlarms(defaultAlarms)
    } else {
      setAlarms(loadedAlarms)
    }
  }, [])

  const getTimeUntilAlarm = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(6, 0, 0, 0)

    const diff = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours} hours ${minutes} minutes`
  }

  const toggleAlarm = (id: string) => {
    setAlarms((prev) => prev.map((alarm) => (alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600">←</span>
            </div>
          </button>
          <div>
            <div className="text-sm text-gray-500">Good Morning 👋</div>
            <div className="font-medium text-gray-900">Ready to unlock your perfect sleep schedule?</div>
          </div>
        </div>
      </div>

      {/* Smart Clock Widget */}
      {smartClockEnabled && (
        <div className="mx-4 mt-4 bg-linear-to-r from-slate-700 to-slate-800 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Alarm in {getTimeUntilAlarm()}</div>
              <div className="flex items-center gap-2 mt-1">
                <Moon className="w-4 h-4" />
                <span className="text-sm">Sleep</span>
              </div>
            </div>
            <Switch
              checked={smartClockEnabled}
              onCheckedChange={setSmartClockEnabled}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </div>
      )}

      {/* Smart Clock Button */}
      {!smartClockEnabled && (
        <div className="px-4 mt-6">
          <Button
            onClick={() => setSmartClockEnabled(true)}
            className="w-full bg-[#4355B9] hover:bg-[#3A4A9F] text-white py-3 rounded-xl font-medium"
          >
            SMART CLOCK
          </Button>
        </div>
      )}

      {/* Add Alarm Button */}
      <div className="px-4 mt-6 flex justify-end">
        <Link href="/clock/set">
          <Button size="lg" className="w-12 h-12 rounded-full bg-[#4355B9] hover:bg-[#3A4A9F] text-white p-0">
            <Plus className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      {/* Alarms List */}
      <div className="px-4 mt-4 space-y-3">
        {alarms.map((alarm) => (
          <div key={alarm.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-light text-gray-900">{alarm.time}</div>
                  <div className="w-2 h-2 bg-[#4355B9] rounded-full"></div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{alarm.label}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Moon className="w-4 h-4 text-[#4355B9]" />
                  <span className="text-sm text-[#4355B9]">{alarm.days.join(", ")}</span>
                </div>
              </div>
              <Switch
                checked={alarm.isActive}
                onCheckedChange={() => toggleAlarm(alarm.id)}
                className="data-[state=checked]:bg-[#4355B9]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation Spacer */}
      <div className="h-20"></div>
    </div>
  )
}
