"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Sun } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { toast } from "sonner"
import { getAlarms, toggleAlarm, deleteAlarm, type Alarm } from "@/lib/services/alarm-service"

export default function AlarmsPage() {
  const router = useRouter()
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Load alarms from service
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
          days: ["Tomorrow-Thu,Sep 2"],
        },
        {
          id: "2",
          time: "6:00 AM",
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

  const handleDeleteAlarm = (id: string) => {
    const updatedAlarms = deleteAlarm(id)
    setAlarms(updatedAlarms)
    toast.success("Alarm deleted")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sun className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm text-gray-500">Good Morning</span>
          </div>
        </div>
        <h1 className="text-2xl font-semibold mt-1">Set Your Alarm</h1>
        <p className="text-sm text-gray-500">Let's build your habits</p>
      </div>

      <div className="flex-1 p-4">
        {alarms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500 mb-4">No alarms set</p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/clock")}>
              Add Alarm
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="bg-white rounded-lg p-4 shadow-xs relative group"
                onClick={() => router.push("/clock")}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-4xl font-light">{alarm.time}</div>
                    <div className="text-sm text-gray-500 mt-1">{alarm.label}</div>
                    <div className="text-xs text-blue-600 mt-1">{alarm.days.join(", ")}</div>
                  </div>
                  <Switch
                    checked={alarm.isActive}
                    onCheckedChange={() => handleToggleAlarm(alarm.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <button
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteAlarm(alarm.id)
                  }}
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-20 right-4">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          onClick={() => router.push("/clock")}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <BottomNav currentPath="/alarms" />
    </div>
  )
}
