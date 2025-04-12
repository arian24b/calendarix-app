"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Clock, Calendar } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { DatePicker } from "@/components/alarm/date-picker"
import { BottomNavigation } from "@/components/ui/bottom-navigation"

export default function NewAppointmentPage() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState("10:00 AM")

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setIsDatePickerOpen(false)
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="p-4 pb-20 flex-1">
        <div className="flex items-center mb-6">
          <Link href="/calendar" className="mr-4">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">New Appointment</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate mb-1">Title</label>
            <input
              type="text"
              className="w-full p-3 border border-[#d7dfee] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter appointment title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate mb-1">Date</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-3 border border-[#d7dfee] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Select date"
                value={selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                readOnly
                onClick={() => setIsDatePickerOpen(true)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Calendar className="w-5 h-5 text-slate" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate mb-1">Time</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-3 border border-[#d7dfee] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Select time"
                value={selectedTime}
                readOnly
                onClick={() => setIsTimePickerOpen(true)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Clock className="w-5 h-5 text-slate" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate mb-1">Description</label>
            <textarea
              className="w-full p-3 border border-[#d7dfee] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary h-24"
              placeholder="Enter description"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate mb-1">Category</label>
            <select className="w-full p-3 border border-[#d7dfee] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white">
              <option>Therapy</option>
              <option>Medication</option>
              <option>Exercise</option>
              <option>Social</option>
              <option>Work</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          <button className="w-full bg-primary text-white font-medium py-3 rounded-xl">Create Appointment</button>
        </div>
      </div>

      {/* Date Picker Action Sheet */}
      <ActionSheet isOpen={isDatePickerOpen} onClose={() => setIsDatePickerOpen(false)}>
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Select Date</h2>
        </div>
        <DatePicker value={selectedDate} onChange={handleDateSelect} />
        <div className="mt-6 flex justify-between">
          <button onClick={() => setIsDatePickerOpen(false)} className="px-6 py-2 rounded-lg border border-[#d7dfee]">
            CANCEL
          </button>
          <button onClick={() => setIsDatePickerOpen(false)} className="px-6 py-2 rounded-lg bg-primary text-white">
            DONE
          </button>
        </div>
      </ActionSheet>

      {/* Time Picker Action Sheet */}
      <ActionSheet isOpen={isTimePickerOpen} onClose={() => setIsTimePickerOpen(false)}>
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Select Time</h2>
        </div>
        <div className="py-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              "8:00 AM",
              "9:00 AM",
              "10:00 AM",
              "11:00 AM",
              "12:00 PM",
              "1:00 PM",
              "2:00 PM",
              "3:00 PM",
              "4:00 PM",
              "5:00 PM",
              "6:00 PM",
              "7:00 PM",
            ].map((time) => (
              <button
                key={time}
                onClick={() => {
                  setSelectedTime(time)
                  setIsTimePickerOpen(false)
                }}
                className={`p-3 rounded-lg ${
                  selectedTime === time ? "bg-primary text-white" : "bg-[#f1f5f9] text-[#48546d]"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button onClick={() => setIsTimePickerOpen(false)} className="px-6 py-2 rounded-lg border border-[#d7dfee]">
            CANCEL
          </button>
          <button onClick={() => setIsTimePickerOpen(false)} className="px-6 py-2 rounded-lg bg-primary text-white">
            DONE
          </button>
        </div>
      </ActionSheet>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  )
}

