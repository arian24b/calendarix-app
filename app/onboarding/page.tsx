"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

export default function OnboardingScreen() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/auth")
    }
  }

  const handleSkip = () => {
    router.push("/auth")
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex justify-end p-4">
        <button onClick={handleSkip} className="text-[#8291ae] font-medium">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center p-6">
        <div className="w-full max-w-md">
          <div className="w-16 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-primary rounded-md"></div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-[#414ba4] mb-2">Calendarix</h1>
            <h2 className="text-2xl font-bold text-[#262626]">It's Time to Organize your Day!</h2>
          </div>

          <div className="mb-8">
            <Image
              src="/placeholder.svg?height=300&width=300"
              alt="Organize your day"
              width={300}
              height={300}
              className="mx-auto"
            />
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-primary text-white font-medium py-3 rounded-xl flex items-center justify-center"
          >
            Get Started
            <ChevronRight className="ml-1 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
