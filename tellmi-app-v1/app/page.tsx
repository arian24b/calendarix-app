"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Search, Plus } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { BottomNavigation } from "@/components/ui/bottom-navigation"

interface Category {
  id: string
  name: string
  color: string
  count?: number
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Sample categories
  const categories: Category[] = [
    { id: "1", name: "Dietary", color: "bg-[#a9e8e8]" },
    { id: "2", name: "Work", color: "bg-[#f5e2a0]" },
    { id: "3", name: "Learn English and Arabic", color: "bg-[#d2ccf2]" },
  ]

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="flex-1 p-4 pb-20">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#8291ae]" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-[#d7dfee] rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {categories.map((category) => (
            <Link
              href={`/category/${category.id}`}
              key={category.id}
              className={`${category.color} rounded-2xl p-4 h-32 flex flex-col justify-between`}
            >
              <h3 className="font-semibold">{category.name}</h3>
              {category.count && <div className="text-2xl font-bold">{category.count}</div>}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center self-end">
                <Plus className="w-5 h-5 text-[#414ba4]" />
              </div>
            </Link>
          ))}

          {/* Add Category Tile */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white border border-[#d7dfee] rounded-2xl p-4 h-32 flex flex-col items-center justify-center"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#414ba4] flex items-center justify-center mb-2">
              <Plus className="w-6 h-6 text-[#414ba4]" />
            </div>
            <span className="text-[#414ba4] font-medium">Add</span>
          </button>
        </div>

        <div className="bg-[#d2ccf2] rounded-2xl p-4 mb-6">
          <h3 className="font-semibold mb-2">Next Appointment</h3>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Dr. Sarah Johnson</p>
                <p className="text-sm text-[#8291ae]">Therapy Session</p>
              </div>
              <div className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-md">10:00 AM</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Today</h2>
            <Link href="/calendar" className="text-primary text-sm font-medium">
              See All
            </Link>
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-[#d7dfee] rounded-xl p-3 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Morning Check-in</p>
                  <p className="text-sm text-[#8291ae]">Daily Routine</p>
                </div>
                <div className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-md">8:00 AM</div>
              </div>
            </div>

            <div className="bg-white border border-[#d7dfee] rounded-xl p-3 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Therapy Session</p>
                  <p className="text-sm text-[#8291ae]">Dr. Sarah Johnson</p>
                </div>
                <div className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-md">10:00 AM</div>
              </div>
            </div>

            <div className="bg-white border border-[#d7dfee] rounded-xl p-3 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Evening Reflection</p>
                  <p className="text-sm text-[#8291ae]">Daily Routine</p>
                </div>
                <div className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-md">7:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Add Category Modal */}
      <ActionSheet isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="relative">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="absolute top-0 right-0 w-6 h-6 bg-[#414ba4] rounded-full flex items-center justify-center text-white"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3L3 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 3L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <h2 className="text-lg font-medium mb-6">Add New Category</h2>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Category name*"
                className="w-full p-3 border border-[#d7dfee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414ba4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8291ae] mb-2">Select Color</label>
              <div className="flex flex-wrap gap-3">
                {["#a9e8e8", "#f5e2a0", "#d2ccf2", "#bac5dc", "#d7dfee", "#8291ae"].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full bg-[${color}] border-2 ${color === "#a9e8e8" ? "border-[#414ba4]" : "border-transparent"}`}
                  ></button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8291ae] mb-2">Icon</label>
              <div className="flex flex-wrap gap-3">
                {["🍎", "💼", "📚", "🏋️", "🧘", "🎮"].map((icon) => (
                  <button
                    key={icon}
                    className={`w-10 h-10 rounded-lg bg-[#f1f5f9] flex items-center justify-center text-lg ${icon === "🍎" ? "border-2 border-[#414ba4]" : ""}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full bg-[#414ba4] text-white font-medium py-3 rounded-lg mt-4">CREATE CATEGORY</button>
          </div>
        </div>
      </ActionSheet>
    </main>
  )
}

