"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreVertical, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"

interface Category {
  id: string
  name: string
  color: string
}

export default function CategoriesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const categories: Category[] = [
    { id: "1", name: "Dietary", color: "bg-[#A8E6E2]" },
    { id: "2", name: "Work", color: "bg-[#F8E3A3]" },
    { id: "3", name: "Learn English and Arabic", color: "bg-[#D8CCFA]" },
  ]

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    router.push(`/category/${categoryId}?name=${encodeURIComponent(categoryName)}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search"
            className="pl-10 border-gray-300 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`${category.color} rounded-lg p-6 relative flex flex-col justify-between h-32`}
              onClick={() => handleCategoryClick(category.id, category.name)}
            >
              <button className="absolute top-2 right-2">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
              <div className="mt-auto">
                <h3 className="text-gray-800 font-medium mb-2">{category.name}</h3>
                <div className="bg-white/30 w-8 h-8 rounded-full flex items-center justify-center">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
          ))}

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-32"
            onClick={() => router.push("/add-category")}
          >
            <h3 className="text-gray-800 font-medium mb-2">Add</h3>
            <div className="border-2 border-gray-400 w-8 h-8 rounded-full flex items-center justify-center">
              <Plus className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
