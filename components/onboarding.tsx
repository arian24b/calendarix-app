"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Clock, Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"

interface OnboardingSlide {
  icon: React.ReactNode
  title: string
  description: string
}

const slides: OnboardingSlide[] = [
  {
    icon: <Calendar className="w-16 h-16 text-white" />,
    title: "Smart Calendar",
    description:
      "Organize your events, appointments, and tasks in one beautiful interface. Never miss an important moment again.",
  },
  {
    icon: <Clock className="w-16 h-16 text-white" />,
    title: "Smart Alarms",
    description:
      "Set intelligent reminders and alarms that adapt to your schedule. Wake up refreshed and stay on track.",
  },
  {
    icon: <Smartphone className="w-16 h-16 text-white" />,
    title: "Works Offline",
    description:
      "Access your calendar and alarms even without internet. Your data syncs automatically when you're back online.",
  },
]

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      handleGetStarted()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleGetStarted = () => {
    localStorage.setItem("hasSeenOnboarding", "true")
    router.push("/auth/register")
  }

  const handleSkip = () => {
    localStorage.setItem("hasSeenOnboarding", "true")
    router.push("/auth/login")
  }

  return (
    <div className="fixed inset-0 bg-linear-to-br from-pink-400 via-purple-500 to-blue-600 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 pt-12">
        <div className="w-8 h-8 bg-white rounded-2xl flex items-center justify-center">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></div>
          </div>
        </div>

        <Button variant="ghost" onClick={handleSkip} className="text-white hover:bg-white/10">
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500" key={currentSlide}>
          <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            {slides[currentSlide].icon}
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">{slides[currentSlide].title}</h1>

          <p className="text-lg text-white/90 leading-relaxed max-w-sm">{slides[currentSlide].description}</p>
        </div>

        {/* Slide Indicators */}
        <div className="flex space-x-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white w-8" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 pb-12">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>

          <Button onClick={nextSlide} className="bg-white text-purple-600 hover:bg-white/90 px-8" size="lg">
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
            {currentSlide < slides.length - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
