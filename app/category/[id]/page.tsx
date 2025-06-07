"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"

export default function CategoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryName = searchParams.get("name") || "Category"

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <div className="p-4">
        <div className="bg-[#A8E6E2] rounded-lg p-6 mb-4">
          <button
            className="bg-white/30 w-8 h-8 rounded-full flex items-center justify-center mb-4"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-medium text-center">{categoryName}</h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center border-2"
            onClick={() => router.push(`/add-event?category=${params.id}&name=${encodeURIComponent(categoryName)}`)}
          >
            <span className="text-lg font-medium mb-2">Add</span>
            <div className="border-2 border-gray-400 w-8 h-8 rounded-full flex items-center justify-center">
              <Plus className="h-5 w-5 text-gray-600" />
            </div>
          </Button>

          <Button
            className="h-32 flex flex-col items-center justify-center bg-[#5C6BC0] hover:bg-[#4a5ab0]"
            onClick={() =>
              router.push(`/ai-suggestions?category=${params.id}&name=${encodeURIComponent(categoryName)}`)
            }
          >
            <span className="text-lg font-medium mb-2 text-white">Get From AI</span>
            <div className="relative">
              <Sparkles className="h-6 w-6 text-white" />
              <div className="absolute -top-1 -right-3 bg-white text-[#5C6BC0] text-xs font-bold px-1 rounded">PRO</div>
            </div>
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
