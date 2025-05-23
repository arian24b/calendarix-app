"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SmartClockProps {
  onComplete?: () => void
}

export function SmartClock({ onComplete }: SmartClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sleepTime, setSleepTime] = useState<Date | null>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const calculateOptimalSleepTime = () => {
    // Calculate sleep time based on 90-minute sleep cycles (5-6 cycles per night)
    const now = new Date()
    const wakeUpTime = new Date(now)
    wakeUpTime.setHours(6, 0, 0, 0) // Default wake up at 6:00 AM

    // If it's already past 6 AM, set wake up time for tomorrow
    if (now.getHours() >= 6) {
      wakeUpTime.setDate(wakeUpTime.getDate() + 1)
    }

    // Calculate time difference in milliseconds
    const timeDiff = wakeUpTime.getTime() - now.getTime()

    // Calculate number of complete sleep cycles (90 minutes each)
    const sleepCycles = Math.floor(timeDiff / (90 * 60 * 1000))

    // Calculate optimal sleep time
    const optimalSleepTime = new Date(wakeUpTime.getTime() - sleepCycles * 90 * 60 * 1000)

    return optimalSleepTime
  }

  const startSmartClock = () => {
    const optimalSleepTime = calculateOptimalSleepTime()
    setSleepTime(optimalSleepTime)
    setIsActive(true)

    // Set an alarm for the calculated sleep time
    const now = new Date()
    const timeUntilSleep = optimalSleepTime.getTime() - now.getTime()

    if (timeUntilSleep > 0) {
      setTimeout(() => {
        if (onComplete) {
          onComplete()
        }
      }, timeUntilSleep)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatHoursMinutes = (date1: Date, date2: Date) => {
    const diff = Math.abs(date2.getTime() - date1.getTime())
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours} hours ${minutes} minutes`
  }

  return (
    <div className="bg-slate-800 text-white rounded-lg p-6 w-full max-w-md">
      <div className="flex flex-col items-center">
        <h2 className="text-lg mb-2">
          {isActive ? "Ready to unlock your perfect sleep schedule?" : "Ready to unlock your perfect sleep schedule?"}
        </h2>

        {isActive && sleepTime && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-300 mb-1">Alarm in</p>
            <p className="text-2xl font-bold">{formatHoursMinutes(currentTime, sleepTime)}</p>
          </div>
        )}

        <Button
          className={cn(
            "w-full py-2 rounded-md mt-4",
            isActive ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700",
          )}
          onClick={startSmartClock}
        >
          {isActive ? "SMART CLOCK ACTIVE" : "SMART CLOCK"}
        </Button>
      </div>
    </div>
  )
}
