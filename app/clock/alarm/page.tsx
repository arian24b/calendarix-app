"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ActionSheet } from "@/components/action-sheet"
import { TimePicker } from "@/components/alarm/time-picker"
import { DatePicker } from "@/components/alarm/date-picker"

export default function AlarmDetailPage() {
  const [isAlarmSheetOpen, setIsAlarmSheetOpen] = useState(true)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState({ hour: 6, minute: 0, period: "AM" as const })
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [alarmName, setAlarmName] = useState("")
  const [isSleepMode, setIsSleepMode] = useState(false)

  const handleOpenDatePicker = () => {
    setIsDatePickerOpen(true)
  }

  const handleSaveAlarm = () => {
    // Save alarm logic here
    setIsAlarmSheetOpen(false)
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="p-4">
        <div className="flex items-center mb-6">
          <Link href="/clock" className="mr-4">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">Alarm Details</h1>
        </div>

        {isSleepMode ? (
          <div className="bg-[#414ba4] rounded-2xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">Alarm in 12 hours 5 minutes</h2>
            <div className="flex justify-end mt-4">
              <button className="bg-white text-[#414ba4] px-4 py-1 rounded-full text-sm font-medium">Sleep</button>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <h2 className="text-lg mb-4">Ready to unlock your perfect sleep schedule?</h2>
            <button
              onClick={() => setIsAlarmSheetOpen(true)}
              className="bg-primary text-white font-medium py-2 px-6 rounded-xl"
            >
              SUBMIT CLOCK
            </button>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Scheduled Times</h3>

          <div className="space-y-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-[#64748b]">WAKEUP TIME</div>
                  <div className="text-sm text-[#64748b]">Tomorrow-Thu,Sep 2</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-bold">6 : 00 AM</div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
                    <div className="text-sm">Sleep</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ActionSheet isOpen={isAlarmSheetOpen} onClose={() => setIsAlarmSheetOpen(false)} title="Set Your Alarm">
        <div className="text-center mb-2">
          <p className="text-[#64748b]">Let's build your habits</p>
        </div>

        <TimePicker value={selectedTime} onChange={setSelectedTime} />

        <div className="mt-6 flex items-center justify-between">
          <button onClick={handleOpenDatePicker} className="flex items-center text-[#64748b]">
            Tomorrow-Thu,Sep 2
          </button>
          <button className="text-primary">Alarm Name</button>
        </div>

        <div className="mt-6 flex justify-between">
          <button onClick={() => setIsAlarmSheetOpen(false)} className="px-6 py-2 rounded-lg border border-[#d1d5db]">
            CANCEL
          </button>
          <button onClick={handleSaveAlarm} className="px-6 py-2 rounded-lg bg-primary text-white">
            SAVE
          </button>
        </div>
      </ActionSheet>

      <ActionSheet isOpen={isDatePickerOpen} onClose={() => setIsDatePickerOpen(false)} title="September">
        <DatePicker
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date)
            setIsDatePickerOpen(false)
          }}
        />

        <div className="mt-6 flex justify-between">
          <button onClick={() => setIsDatePickerOpen(false)} className="px-6 py-2 rounded-lg border border-[#d1d5db]">
            CANCEL
          </button>
          <button onClick={() => setIsDatePickerOpen(false)} className="px-6 py-2 rounded-lg bg-primary text-white">
            DONE
          </button>
        </div>
      </ActionSheet>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between px-8 py-2">
        <Link href="/" className="flex flex-col items-center text-slate">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.02 2.84001L3.63 7.04001C2.73 7.74001 2 9.23001 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29001 21.19 7.74001 20.2 7.05001L14.02 2.72001C12.62 1.74001 10.37 1.79001 9.02 2.84001Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17.99V14.99"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/calendar" className="flex flex-col items-center text-slate">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 2V5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 2V5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 9.09H20.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.6947 13.7H15.7037"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.6947 16.7H15.7037"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.9955 13.7H12.0045"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.9955 16.7H12.0045"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.29431 13.7H8.30329"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.29431 16.7H8.30329"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs mt-1">Calendar</span>
        </Link>
        <Link href="/clock" className="flex flex-col items-center text-primary">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs mt-1">Clock</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-slate">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.51C8.71997 7.7 10.18 6.23 12 6.23C13.81 6.23 15.28 7.7 15.28 9.51C15.27 11.28 13.88 12.72 12.12 12.78Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.74 19.38C16.96 21.01 14.6 22 12 22C9.40001 22 7.04001 21.01 5.26001 19.38C5.36001 18.44 5.96001 17.52 7.03001 16.8C9.77001 14.98 14.25 14.98 16.97 16.8C18.04 17.52 18.64 18.44 18.74 19.38Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </nav>
    </main>
  )
}
