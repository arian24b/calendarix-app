"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

export default function DatePickerPage() {
  const router = useRouter()
  const [selectedMonth, setSelectedMonth] = useState("SEP")
  const [selectedDay, setSelectedDay] = useState("02")
  const [selectedYear, setSelectedYear] = useState("2025")

  const months = [
    { short: "AUG", full: "August", day: "01" },
    { short: "SEP", full: "September", day: "02" },
    { short: "OCT", full: "October", day: "03" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center">
            <span className="text-lg font-medium mr-2">September</span>
            <ChevronUp className="h-5 w-5 text-gray-600" />
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="space-y-8">
          {months.map((month, index) => (
            <div
              key={month.short}
              className={cn(
                "flex items-center justify-between w-80 px-8",
                selectedMonth === month.short ? "opacity-100" : "opacity-50",
              )}
            >
              <div
                className={cn(
                  "text-4xl font-light",
                  selectedMonth === month.short ? "text-[#4355B9]" : "text-gray-400",
                )}
              >
                {month.short}
              </div>
              <div className="text-4xl font-light text-gray-700">{month.day}</div>
              {selectedMonth === month.short && <div className="text-4xl font-light text-gray-700">{selectedYear}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            CANCEL
          </Button>
          <Button className="bg-[#4355B9] hover:bg-[#3A4A9F]" onClick={() => router.back()}>
            DONE
          </Button>
        </div>
      </div>

      <BottomNav currentPath="/clock" />
    </div>
  )
}
