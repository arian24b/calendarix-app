"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

export default function CategoriesPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-6">Categories</h1>

        <div className="grid grid-cols-2 gap-4">
          <Card
            className="p-4 h-32 flex flex-col justify-between bg-[#a8e6e2] border-none rounded-xl"
            onClick={() => router.push("/dietary")}
          >
            <div>
              <h3 className="font-medium text-gray-800">Dietary</h3>
            </div>
            <div className="self-end bg-white rounded-full p-1.5">
              <Plus className="h-5 w-5 text-gray-600" />
            </div>
          </Card>

          <Card className="p-4 h-32 flex flex-col justify-between bg-[#fae3a8] border-none rounded-xl">
            <div>
              <h3 className="font-medium text-gray-800">Work</h3>
            </div>
            <div className="self-end bg-white rounded-full p-1.5">
              <Plus className="h-5 w-5 text-gray-600" />
            </div>
          </Card>

          <Card className="p-4 h-32 flex flex-col justify-between bg-[#d8d0f0] border-none rounded-xl">
            <div>
              <h3 className="font-medium text-gray-800">Learn English and Arabic</h3>
            </div>
            <div className="self-end bg-white rounded-full p-1.5">
              <Plus className="h-5 w-5 text-gray-600" />
            </div>
          </Card>

          <Card className="p-4 h-32 flex flex-col justify-between bg-white border-gray-200 rounded-xl">
            <div>
              <h3 className="font-medium text-gray-800">Add New Category</h3>
            </div>
            <div className="self-end bg-gray-100 rounded-full p-1.5">
              <Plus className="h-5 w-5 text-gray-600" />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-auto">
        <BottomNav currentPath="/categories" />
      </div>
    </div>
  )
}
