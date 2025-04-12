"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [greeting, setGreeting] = useState("Hello")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good Morning")
    else if (hour < 18) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")
  }, [])

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  return (
    <main className="flex min-h-screen flex-col bg-[#fffdf8]">
      <div className="flex-1 p-4 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg text-[#656565]">{greeting}</h2>
            <h1 className="text-2xl font-bold text-[#262626]">User</h1>
          </div>
          <button
            onClick={() => router.push("/auth")}
            className="p-2 bg-[#f1f5f9] rounded-full text-[#8291ae]"
            aria-label="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        {/* Date and Time */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#8291ae] text-sm">Today</p>
              <p className="text-lg font-medium">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="bg-primary text-white px-3 py-2 rounded-lg">
              <p className="text-xl font-bold">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[#a9e8e8] rounded-xl p-4 flex flex-col items-center justify-center h-24">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-sm font-medium">Calendar</span>
          </div>
          <div className="bg-[#d2ccf2] rounded-xl p-4 flex flex-col items-center justify-center h-24">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-sm font-medium">Alarms</span>
          </div>
          <div className="bg-[#f5e2a0] rounded-xl p-4 flex flex-col items-center justify-center h-24">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="text-sm font-medium">Events</span>
          </div>
        </div>

        {/* Upcoming Events */}
        <h2 className="text-lg font-bold mb-3">Upcoming Events</h2>
        <div className="space-y-3">
          {[
            { title: "Team Meeting", category: "Work", time: "10:00 AM" },
            { title: "Doctor Appointment", category: "Health", time: "2:30 PM" },
            { title: "Gym Session", category: "Fitness", time: "6:00 PM" },
          ].map((event, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-[#8291ae]">{event.category}</p>
                </div>
                <div className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-md">{event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between px-8 py-2">
        <Link href="/dashboard" className="flex flex-col items-center text-primary">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/calendar" className="flex flex-col items-center text-[#8291ae]">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span className="text-xs mt-1">Calendar</span>
        </Link>
        <Link href="/clock" className="flex flex-col items-center text-[#8291ae]">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <span className="text-xs mt-1">Clock</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-[#8291ae]">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </nav>
    </main>
  )
}
