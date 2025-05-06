"use client"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

export default function DietaryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-4">
        <Button variant="ghost" size="sm" className="mb-4 pl-0" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </Button>

        <Card className="p-4 mb-6 bg-[#a8e6e2] border-none rounded-xl">
          <h2 className="font-medium text-gray-800">Dietary</h2>
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Diet for 1 month</span>
              <span>Start: Fri, March 7</span>
            </div>
            <div className="flex justify-between">
              <span>weight maintenance</span>
              <span>End: Fri, April 7</span>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Breakfast</h3>
          <Card className="p-4 bg-white border-gray-200 rounded-xl">
            <h4 className="font-medium mb-2">Oatmeal with Fruits</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>1/2 cup rolled oats</li>
              <li>1 cup almond milk</li>
              <li>1 tablespoon honey</li>
              <li>1/2 banana, sliced</li>
              <li>1/4 cup berries</li>
              <li>1 tablespoon chia seeds</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              Cook oats with almond milk, top with fruits, honey, and chia seeds. Approximately 350 calories.
            </p>
          </Card>

          <h3 className="font-medium text-lg mt-6">Lunch</h3>
          <Card className="p-4 bg-white border-gray-200 rounded-xl">
            <h4 className="font-medium mb-2">Grilled Chicken Salad</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>4 oz grilled chicken breast</li>
              <li>2 cups mixed greens</li>
              <li>1/4 cup cherry tomatoes</li>
              <li>1/4 cucumber, sliced</li>
              <li>1/4 avocado</li>
              <li>1 tbsp olive oil and lemon dressing</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              Combine all ingredients in a bowl, drizzle with dressing. Approximately 400 calories.
            </p>
          </Card>

          <h3 className="font-medium text-lg mt-6">Dinner</h3>
          <Card className="p-4 bg-white border-gray-200 rounded-xl">
            <h4 className="font-medium mb-2">Baked Salmon with Vegetables</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>5 oz salmon fillet</li>
              <li>1 cup roasted broccoli</li>
              <li>1/2 cup quinoa</li>
              <li>1 tbsp olive oil</li>
              <li>Lemon and herbs to taste</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              Bake salmon with lemon and herbs, serve with quinoa and roasted broccoli. Approximately 450 calories.
            </p>
          </Card>

          <h3 className="font-medium text-lg mt-6">Snacks</h3>
          <Card className="p-4 bg-white border-gray-200 rounded-xl">
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>1 apple with 1 tbsp almond butter</li>
              <li>1 Greek yogurt with berries</li>
              <li>1 handful of mixed nuts (about 1 oz)</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              Choose one snack between meals. Each snack is approximately 150-200 calories.
            </p>
          </Card>
        </div>
      </div>

      <div className="mt-auto">
        <BottomNav currentPath="/dietary" />
      </div>
    </div>
  )
}
