"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, Sun } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { getAlarms, toggleAlarm, type Alarm } from "@/lib/services/alarm-service"

export default function ClockPage() {
  const router = useRouter()
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [showSmartClock, setShowSmartClock] = useState(false)

  useEffect(() => {
    const loadedAlarms = getAlarms()
    if (loadedAlarms.length === 0) {
      // Set default alarms if none exist
      const defaultAlarms: Alarm[] = [
        {
          id: "1",
          time: "6 : 00 AM",
          label: "breakfast time!",
          isActive: true,
          days: ["Tomorrow-Thu,Sep 2"],
        },
        {
          id: "2",
          time: "6 : 00 AM",
          label: "breakfast time!",
          isActive: true,
          days: ["Tomorrow-Thu,Sep 2"],
        },
        {
          id: "3",
          time: "6 : 00 AM",
          label: "breakfast time!",
          isActive: true,
          days: ["Tomorrow-Thu,Sep 2"],
        },
      ]
      localStorage.setItem("alarms", JSON.stringify(defaultAlarms))
      setAlarms(defaultAlarms)
    } else {
      setAlarms(loadedAlarms)
    }
  }, [])

  const handleToggleAlarm = (id: string) => {
    const updatedAlarms = toggleAlarm(id)
    setAlarms(updatedAlarms)
  }

  const calculateTimeUntilAlarm = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(6, 0, 0, 0)

    const timeDiff = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(timeDiff / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours} hours ${minutes} minutes`
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center mb-2">
          <Sun className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="text-sm text-gray-500">Good Morning</span>
        </div>
        <h1 className="text-2xl font-semibold">Set Your Alarm</h1>
        <p className="text-sm text-gray-500">Let's build your habits</p>
      </div>

      <div className="flex-1 p-4">
        {showSmartClock && (
          <div className="mb-6 flex flex-col items-center">
            <div className="bg-white rounded-lg p-4 w-full max-w-sm text-center mb-4">
              <p className="text-sm text-gray-600 mb-2">Ready to unlock your perfect sleep schedule?</p>
              <Button
                className="bg-[#4355B9] hover:bg-[#3A4A9F] text-white px-8"
                onClick={() => setShowSmartClock(false)}
              >
                SMART CLOCK
              </Button>
            </div>
            <div className="bg-[#4A5568] text-white rounded-lg p-4 w-full max-w-sm text-center mb-4">
              <p className="text-sm mb-1">Alarm in {calculateTimeUntilAlarm()}</p>
              <div className="flex items-center justify-center">
                <Switch checked={true} className="mr-2" />
                <span className="text-sm">Sleep</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {alarms.map((alarm) => (
            <div key={alarm.id} className="bg-white rounded-lg p-4 shadow-xs">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="text-2xl font-light text-gray-700">{alarm.time}</div>
                  <div className="text-sm text-gray-500">{alarm.label}</div>
                  <div className="text-xs text-[#4355B9] mt-1">{alarm.days.join(", ")}</div>
                </div>
                <Switch checked={alarm.isActive} onCheckedChange={() => handleToggleAlarm(alarm.id)} />
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#4355B9] rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Sleep</span>
              </div>
            </div>
          ))}
        </div>

        {!showSmartClock && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              className="text-[#4355B9] border-[#4355B9]"
              onClick={() => setShowSmartClock(true)}
            >
              Show Smart Clock
            </Button>
          </div>
        )}
      </div>

      <div className="fixed bottom-20 right-4">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-[#4355B9] hover:bg-[#3A4A9F] shadow-lg"
          onClick={() => router.push("/clock/set")}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <BottomNav currentPath="/clock" />
    </div>
  )
}
