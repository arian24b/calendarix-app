"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface TimePickerProps {
  value: {
    hour: number
    minute: number
    period: "AM" | "PM"
  }
  onChange: (time: { hour: number; minute: number; period: "AM" | "PM" }) => void
}

export function ScrollableTimePicker({ value, onChange }: TimePickerProps) {
  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)
  const periodRef = useRef<HTMLDivElement>(null)

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  const periods = ["AM", "PM"]

  const scrollToValue = (ref: HTMLDivElement | null, index: number) => {
    if (ref) {
      const itemHeight = 60
      ref.scrollTop = index * itemHeight
    }
  }

  useEffect(() => {
    scrollToValue(hourRef.current, value.hour - 1)
    scrollToValue(minuteRef.current, value.minute)
    scrollToValue(periodRef.current, value.period === "AM" ? 0 : 1)
  }, [value])

  const handleScroll = (ref: HTMLDivElement, values: (number | string)[], type: "hour" | "minute" | "period") => {
    const itemHeight = 60
    const scrollTop = ref.scrollTop
    const index = Math.round(scrollTop / itemHeight)
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1))

    if (type === "hour") {
      onChange({ ...value, hour: values[clampedIndex] as number })
    } else if (type === "minute") {
      onChange({ ...value, minute: values[clampedIndex] as number })
    } else if (type === "period") {
      onChange({ ...value, period: values[clampedIndex] as "AM" | "PM" })
    }

    // Snap to the nearest value
    setTimeout(() => {
      ref.scrollTop = clampedIndex * itemHeight
    }, 100)
  }

  const renderScrollableList = (
    values: (number | string)[],
    selectedValue: number | string,
    type: "hour" | "minute" | "period",
    ref: React.RefObject<HTMLDivElement>,
  ) => (
    <div className="relative h-48 overflow-hidden">
      {/* Selection indicator */}
      <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-12 bg-gray-100 rounded-lg z-10 pointer-events-none" />

      <div
        ref={ref}
        className="h-full overflow-y-scroll scrollbar-hide snap-y snap-mandatory"
        onScroll={(e) => handleScroll(e.currentTarget, values, type)}
        style={{ scrollSnapType: "y mandatory" }}
      >
        {/* Padding items */}
        <div className="h-24" />

        {values.map((val, index) => (
          <div
            key={index}
            className="h-12 flex items-center justify-center text-2xl font-light snap-center"
            style={{
              color: val === selectedValue ? "#1f2937" : "#9ca3af",
              fontWeight: val === selectedValue ? "400" : "300",
            }}
          >
            {type === "minute" ? String(val).padStart(2, "0") : val}
          </div>
        ))}

        {/* Padding items */}
        <div className="h-24" />
      </div>
    </div>
  )

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Hours */}
      <div className="flex-1">{renderScrollableList(hours, value.hour, "hour", hourRef)}</div>

      {/* Separator */}
      <div className="text-3xl font-light text-gray-400 px-2">:</div>

      {/* Minutes */}
      <div className="flex-1">{renderScrollableList(minutes, value.minute, "minute", minuteRef)}</div>

      {/* Period */}
      <div className="flex-1">{renderScrollableList(periods, value.period, "period", periodRef)}</div>
    </div>
  )
}
