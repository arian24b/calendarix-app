"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimePickerProps {
  date?: Date
  setDate: (date: Date) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)

  const handleSelect = (date?: Date) => {
    if (!date) return

    setSelectedDate(date)

    // Preserve the time from the previous date if it exists
    if (selectedDate) {
      date.setHours(selectedDate.getHours())
      date.setMinutes(selectedDate.getMinutes())
    }

    setDate(date)
  }

  const handleTimeChange = (type: "hours" | "minutes", value: string) => {
    if (!selectedDate) return

    const newDate = new Date(selectedDate)

    if (type === "hours") {
      newDate.setHours(Number.parseInt(value))
    } else {
      newDate.setMinutes(Number.parseInt(value))
    }

    setSelectedDate(newDate)
    setDate(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} initialFocus />
        <div className="p-3 border-t flex gap-2">
          <Select
            value={selectedDate ? selectedDate.getHours().toString() : undefined}
            onValueChange={(value) => handleTimeChange("hours", value)}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }).map((_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedDate ? selectedDate.getMinutes().toString() : undefined}
            onValueChange={(value) => handleTimeChange("minutes", value)}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }).map((_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
}
