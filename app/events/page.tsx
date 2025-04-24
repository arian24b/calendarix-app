"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"

interface Event {
  id: string
  title: string
  time: string
  category: string
  color: string
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample events data
  const events: Event[] = [
    {
      id: "1",
      title: "Morning Meditation",
      time: "8:00 AM",
      category: "Wellness",
      color: "bg-[#a9e8e8]",
    },
    {
      id: "2",
      title: "Team Meeting",
      time: "10:00 AM",
      category: "Work",
      color: "bg-[#f5e2a0]",
    },
    {
      id: "3",
      title: "English Lesson",
      time: "2:00 PM",
      category: "Learning",
      color: "bg-[#d2ccf2]",
    },
    {
      id: "4",
      title: "Evening Workout",
      time: "6:00 PM",
      category: "Fitness",
      color: "bg-[#a9e8e8]",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="flex-1 p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Events</h1>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#8291ae]" />
            </div>
            <input
              type="text"
              placeholder="Search events"
              className="w-full pl-10 pr-4 py-2 border border-[#d7dfee] rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-2 border border-[#d7dfee] rounded-full">
            <Filter className="h-5 w-5 text-[#8291ae]" />
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-3 p-3 border border-[#d7dfee] rounded-xl">
              <div className={`${event.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <span className="text-lg font-bold">{event.time.split(":")[0]}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-[#8291ae]">{event.time}</p>
              </div>
              <div className="text-xs px-2 py-1 bg-[#f1f5f9] rounded-full text-[#8291ae]">{event.category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Add New Event Button */}
      <Link
        href="/appointment/new"
        className="fixed bottom-20 right-4 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
      >
        <span className="text-2xl font-bold">+</span>
      </Link>
    </main>
  )
}
