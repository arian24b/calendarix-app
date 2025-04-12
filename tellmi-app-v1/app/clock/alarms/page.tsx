"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { BottomNavigation } from "@/components/ui/bottom-navigation"

interface Alarm {
  id: number
  time: string
  period: string
  days: string[]
  enabled: boolean
}

export default function AlarmsPage() {
  // Sample alarm data
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: 1, time: "6:00", period: "AM", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], enabled: true },
    { id: 2, time: "7:30", period: "AM", days: ["Sat", "Sun"], enabled: false },
    { id: 3, time: "9:15", period: "PM", days: ["Mon", "Wed", "Fri"], enabled: true },
  ])

  const handleToggleAlarm = (id: number, enabled: boolean) => {
    setAlarms(alarms.map((alarm) => (alarm.id === id ? { ...alarm, enabled } : alarm)))
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#fffdf8]">
      <div className="flex-1 p-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#262626]">Alarms</h1>
          <Link href="/clock/new">
            <button className="w-10 h-10 rounded-full bg-[#414ba4] flex items-center justify-center text-white">
              <Plus className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <div className="space-y-4">
          {alarms.map((alarm) => (
            <div key={alarm.id} className="bg-white border border-[#d7dfee] rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold text-[#262626]">
                    {alarm.time} {alarm.period}
                  </p>
                  <p className="text-sm text-[#8291ae]">{alarm.days.join(", ")}</p>
                </div>
                <Switch checked={alarm.enabled} onCheckedChange={(checked) => handleToggleAlarm(alarm.id, checked)} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/clock/new">
            <button className="w-full bg-[#414ba4] text-white font-medium py-3 rounded-xl">ADD NEW ALARM</button>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  )
}

