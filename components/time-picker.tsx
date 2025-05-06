"use client"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
}

export function TimePickerDemo({ value, onChange }: TimePickerProps) {
  const [hours, minutes] = value.split(":").map(Number)

  const incrementHour = () => {
    const newHours = (hours + 1) % 24
    onChange(`${newHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`)
  }

  const decrementHour = () => {
    const newHours = (hours - 1 + 24) % 24
    onChange(`${newHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`)
  }

  const incrementMinute = () => {
    const newMinutes = (minutes + 1) % 60
    onChange(`${hours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`)
  }

  const decrementMinute = () => {
    const newMinutes = (minutes - 1 + 60) % 60
    onChange(`${hours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`)
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex flex-col items-center">
        <Button variant="ghost" size="icon" onClick={incrementHour}>
          <ChevronUp className="h-4 w-4" />
        </Button>
        <div className="text-4xl font-bold w-16 text-center">{hours.toString().padStart(2, "0")}</div>
        <Button variant="ghost" size="icon" onClick={decrementHour}>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-4xl font-bold">:</div>

      <div className="flex flex-col items-center">
        <Button variant="ghost" size="icon" onClick={incrementMinute}>
          <ChevronUp className="h-4 w-4" />
        </Button>
        <div className="text-4xl font-bold w-16 text-center">{minutes.toString().padStart(2, "0")}</div>
        <Button variant="ghost" size="icon" onClick={decrementMinute}>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
