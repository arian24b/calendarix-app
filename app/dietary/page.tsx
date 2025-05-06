"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, X, ChevronDown } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DietaryPage() {
  const router = useRouter()
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [dietGoal, setDietGoal] = useState<string | null>(null)
  const [dietGoalOpen, setDietGoalOpen] = useState(false)
  const [activityLevel, setActivityLevel] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null)
  const [selectedMeals, setSelectedMeals] = useState<string[]>([])

  const toggleMeal = (meal: string) => {
    if (selectedMeals.includes(meal)) {
      setSelectedMeals(selectedMeals.filter((m) => m !== meal))
    } else {
      setSelectedMeals([...selectedMeals, meal])
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-4">
        <Card className="p-4 mb-6 bg-[#a8e6e2] border-none rounded-xl">
          <h2 className="font-medium text-gray-800">Dietary</h2>
          {showDetails && (
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
          )}
        </Card>

        <div className="flex gap-4 mb-6">
          <Card
            className="flex-1 p-4 h-32 flex flex-col justify-between items-center bg-white border-gray-200 rounded-xl"
            onClick={() => setShowAddEvent(true)}
          >
            <div className="text-center">
              <h3 className="font-medium text-gray-800">Add</h3>
            </div>
            <div className="bg-gray-100 rounded-full p-1.5">
              <Plus className="h-5 w-5 text-gray-600" />
            </div>
          </Card>

          <Card className="flex-1 p-4 h-32 flex flex-col justify-between items-center bg-[#4f46e5] border-none rounded-xl text-white">
            <div className="text-center">
              <h3 className="font-medium">Get From AI</h3>
            </div>
            <div className="bg-white rounded-full p-1.5">
              <Sparkles className="h-5 w-5 text-[#4f46e5]" />
            </div>
          </Card>
        </div>

        {showDetails && (
          <>
            <div className="mb-2 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-blue-500 mr-2"></div>
                <span className="font-medium">Day 1</span>
              </div>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowDetails(true)}>
                DETAILS
              </Button>
            </div>

            <Card className="mb-4 p-3 bg-white border-gray-200 rounded-xl">
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs text-gray-500">14:00-15:00</span>
                </div>
                <span className="text-xs text-gray-500">Fri, March 7</span>
              </div>
              <h4 className="font-medium">Breakfast</h4>
              <p className="text-xs text-gray-500">Define the problem or question that...</p>
              <p className="text-xs text-blue-500 mt-1">View more</p>
            </Card>

            <Card className="mb-4 p-3 bg-white border-gray-200 rounded-xl">
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs text-gray-500">14:00-15:00</span>
                </div>
                <span className="text-xs text-gray-500">Fri, March 7</span>
              </div>
              <h4 className="font-medium">Lunch</h4>
              <p className="text-xs text-gray-500">Define the problem or question that...</p>
              <p className="text-xs text-blue-500 mt-1">View more</p>
            </Card>

            <Card className="mb-4 p-3 bg-white border-gray-200 rounded-xl">
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs text-gray-500">14:00-15:00</span>
                </div>
                <span className="text-xs text-gray-500">Fri, March 7</span>
              </div>
              <h4 className="font-medium">Dinner</h4>
              <p className="text-xs text-gray-500">Define the problem or question that...</p>
              <p className="text-xs text-blue-500 mt-1">View more</p>
            </Card>

            <div className="mb-2 mt-6 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-blue-500 mr-2"></div>
                <span className="font-medium">Day 2</span>
              </div>
            </div>
          </>
        )}

        {!showDetails && (
          <div className="flex flex-col items-center justify-center mt-10">
            <p className="text-gray-500 mb-4">Get started with your dietary plan</p>
            <Button className="bg-[#4f46e5] hover:bg-[#4338ca]" onClick={() => setShowDetails(true)}>
              Get for 1 month
            </Button>
            <div className="flex mt-4">
              <div className="text-xs text-gray-500">Start</div>
              <div className="text-xs ml-4">Fri, March 7</div>
            </div>
            <div className="flex mt-1">
              <div className="text-xs text-gray-500">End</div>
              <div className="text-xs ml-6">Fri, April 7</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <BottomNav currentPath="/dietary" />
      </div>

      {/* Add New Event Sheet */}
      <Sheet open={showAddEvent} onOpenChange={setShowAddEvent}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
          <SheetHeader className="relative">
            <SheetTitle className="text-center">Add New Event</SheetTitle>
            <SheetClose className="absolute right-0 top-0 rounded-full bg-gray-100 p-1">
              <X className="h-4 w-4" />
            </SheetClose>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div>
              <Input placeholder="Event name*" className="border-gray-300" />
            </div>

            <div>
              <Input placeholder="Type the note here..." className="border-gray-300" />
            </div>

            <div className="relative">
              <div
                className="flex justify-between items-center p-3 border border-gray-300 rounded-md"
                onClick={() => setDietGoalOpen(!dietGoalOpen)}
              >
                <span className="text-gray-500">{dietGoal || "What is the goal of the diet?"}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>

              {dietGoalOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 z-10">
                  <div
                    className="p-3 hover:bg-gray-100"
                    onClick={() => {
                      setDietGoal("Weight loss")
                      setDietGoalOpen(false)
                    }}
                  >
                    Weight loss
                  </div>
                  <div
                    className="p-3 hover:bg-gray-100"
                    onClick={() => {
                      setDietGoal("Weight gain")
                      setDietGoalOpen(false)
                    }}
                  >
                    Weight gain
                  </div>
                  <div
                    className="p-3 hover:bg-gray-100"
                    onClick={() => {
                      setDietGoal("Weight maintenance")
                      setDietGoalOpen(false)
                    }}
                  >
                    Weight maintenance
                  </div>
                  <div
                    className="p-3 hover:bg-gray-100"
                    onClick={() => {
                      setDietGoal("Muscle building")
                      setDietGoalOpen(false)
                    }}
                  >
                    Muscle building
                  </div>
                  <div
                    className="p-3 hover:bg-gray-100"
                    onClick={() => {
                      setDietGoal("Vegan")
                      setDietGoalOpen(false)
                    }}
                  >
                    Vegan
                  </div>
                  <div
                    className="p-3 hover:bg-gray-100"
                    onClick={() => {
                      setDietGoal("Vegetarian")
                      setDietGoalOpen(false)
                    }}
                  >
                    Vegetarian
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55+">55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Height" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150-160">150-160 cm</SelectItem>
                    <SelectItem value="161-170">161-170 cm</SelectItem>
                    <SelectItem value="171-180">171-180 cm</SelectItem>
                    <SelectItem value="181-190">181-190 cm</SelectItem>
                    <SelectItem value="191+">191+ cm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex">
                <Input placeholder="Weight" className="rounded-r-none border-r-0" />
                <div className="flex items-center justify-center px-3 border border-l-0 border-gray-300 rounded-r-md bg-gray-50">
                  Kg
                </div>
              </div>

              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="2">2 Months</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Meal plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold mb-2 text-gray-500">ACTIVITY LEVEL</h4>
              <p className="text-xs mb-2">How much physical activity do you do daily?</p>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <RadioGroup value={activityLevel || ""} onValueChange={setActivityLevel} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate">Moderate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high">High</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold mb-2 text-gray-500">DISEASES OR ALLERGIES</h4>
              <p className="text-xs mb-2">Do you have any specific medical conditions or food allergies?</p>
              <Input placeholder="Please Type..." className="border-gray-300" />
            </div>

            <Button className="w-full bg-[#4f46e5] hover:bg-[#4338ca]">CREATE EVENT</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
