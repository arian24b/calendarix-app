"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AiSuggestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category") || ""
  const categoryName = searchParams.get("name") || "Category"

  const [isGenerating, setIsGenerating] = useState(true)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    // Simulate AI generating suggestions
    const timer = setTimeout(() => {
      const mockSuggestions = getMockSuggestions(categoryName)
      setSuggestions(mockSuggestions)
      setIsGenerating(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [categoryName])

  const getMockSuggestions = (category: string) => {
    if (category.toLowerCase() === "dietary") {
      return [
        "Create a 7-day meal plan for weight loss",
        "Track your water intake daily",
        "Plan a high-protein diet for muscle building",
        "Create a vegetarian meal plan",
        "Track your calorie intake for 30 days",
      ]
    } else if (category.toLowerCase() === "work") {
      return [
        "Set up weekly progress meetings",
        "Create a daily task prioritization routine",
        "Schedule focused work blocks",
        "Plan quarterly goal review sessions",
        "Establish a morning productivity ritual",
      ]
    } else {
      return [
        "Create a daily practice routine",
        "Schedule weekly review sessions",
        "Set up milestone tracking",
        "Plan regular assessment checkpoints",
        "Establish a reward system for achievements",
      ]
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    if (categoryName.toLowerCase() === "dietary") {
      router.push(
        `/add-dietary-event?name=${encodeURIComponent(categoryName)}&suggestion=${encodeURIComponent(suggestion)}`,
      )
    } else {
      router.push(
        `/add-event?category=${categoryId}&name=${encodeURIComponent(categoryName)}&suggestion=${encodeURIComponent(suggestion)}`,
      )
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="p-4">
        <div className="bg-[#A8E6E2] rounded-lg p-6 mb-4 relative">
          <button
            className="bg-white/30 w-8 h-8 rounded-full flex items-center justify-center absolute left-4 top-4"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-medium text-center">{categoryName}</h1>
          <button
            className="bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center absolute right-4 top-4"
            onClick={() => router.back()}
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <h2 className="text-xl font-semibold mr-2">AI Suggestions</h2>
            <Sparkles className="h-5 w-5 text-[#5C6BC0]" />
          </div>
          <p className="text-gray-600">Select a suggestion to create an event</p>
        </div>

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C6BC0] mb-4"></div>
            <p className="text-gray-600">Generating suggestions...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <p>{suggestion}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full py-4 border-[#5C6BC0] text-[#5C6BC0]" onClick={() => router.back()}>
          BACK TO CATEGORY
        </Button>
      </div>
    </div>
  )
}
