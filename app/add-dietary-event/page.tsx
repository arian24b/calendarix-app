"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function AddDietaryEventPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryName = searchParams.get("name") || "Dietary"

  const [dietGoal, setDietGoal] = useState("")
  const [age, setAge] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [gender, setGender] = useState("")
  const [duration, setDuration] = useState("")
  const [mealPlan, setMealPlan] = useState("")
  const [activityLevel, setActivityLevel] = useState("low")
  const [allergies, setAllergies] = useState("")

  const handleCreateEvent = () => {
    if (!dietGoal) {
      toast.error("Please select a diet goal")
      return
    }

    // Save the dietary plan to localStorage
    const dietaryPlan = {
      id: Date.now().toString(),
      dietGoal,
      age,
      height,
      weight,
      gender,
      duration,
      mealPlan,
      activityLevel,
      allergies,
      createdAt: new Date().toISOString(),
    }

    // Get existing dietary plans
    const existingPlans = localStorage.getItem("dietaryPlans")
    const plans = existingPlans ? JSON.parse(existingPlans) : []

    // Add new plan
    plans.push(dietaryPlan)

    // Save back to localStorage
    localStorage.setItem("dietaryPlans", JSON.stringify(plans))

    toast.success("Dietary plan created successfully")
    router.back()
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
          <h2 className="text-xl font-semibold">Add New Event</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Select onValueChange={setDietGoal}>
              <SelectTrigger className="w-full border-gray-300">
                <SelectValue placeholder="What is the goal of the diet?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="health-improvement">Health Improvement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select onValueChange={setAge}>
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Age" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 80 }, (_, i) => i + 18).map((age) => (
                    <SelectItem key={age} value={age.toString()}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select onValueChange={setHeight}>
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Height" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 100 }, (_, i) => i + 150).map((height) => (
                    <SelectItem key={height} value={height.toString()}>
                      {height} cm
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select onValueChange={setGender}>
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Input
                type="number"
                placeholder="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border-gray-300"
              />
              <span className="ml-2">Kg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select onValueChange={setDuration}>
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-week">1 Week</SelectItem>
                  <SelectItem value="2-weeks">2 Weeks</SelectItem>
                  <SelectItem value="1-month">1 Month</SelectItem>
                  <SelectItem value="3-months">3 Months</SelectItem>
                  <SelectItem value="6-months">6 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select onValueChange={setMealPlan}>
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Meal plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-meals">3 Meals</SelectItem>
                  <SelectItem value="5-meals">5 Meals</SelectItem>
                  <SelectItem value="intermittent-fasting">Intermittent Fasting</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase text-gray-500 mb-2">ACTIVITY LEVEL</h3>
            <p className="text-sm text-gray-600 mb-2">How much physical activity do you do daily?</p>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activity-low"
                  checked={activityLevel === "low"}
                  onCheckedChange={() => setActivityLevel("low")}
                />
                <label htmlFor="activity-low" className="text-sm">
                  Low
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activity-moderate"
                  checked={activityLevel === "moderate"}
                  onCheckedChange={() => setActivityLevel("moderate")}
                />
                <label htmlFor="activity-moderate" className="text-sm">
                  Moderate
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activity-high"
                  checked={activityLevel === "high"}
                  onCheckedChange={() => setActivityLevel("high")}
                />
                <label htmlFor="activity-high" className="text-sm">
                  High
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase text-gray-500 mb-2">DISEASES OR ALLERGIES</h3>
            <p className="text-sm text-gray-600 mb-2">Do you have any specific medical conditions or food allergies?</p>
            <Textarea
              placeholder="Please Type..."
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="min-h-[80px] border-gray-300"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto p-4">
        <Button className="w-full bg-[#5C6BC0] hover:bg-[#4a5ab0] py-6" onClick={handleCreateEvent}>
          CREATE EVENT
        </Button>
      </div>
    </div>
  )
}
