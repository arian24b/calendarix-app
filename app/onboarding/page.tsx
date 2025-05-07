"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const onboardingSlides = [
  {
    title: "",
    description: "It'S Time to Organize your Day!",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    title: "Manage Your Calendar",
    description: "Easily view and manage your events, set reminders, and stay on top of your schedule.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    title: "Set Alarms",
    description: "Create custom alarms with personalized sounds and schedules to never miss an important event.",
    image: "/placeholder.svg?height=300&width=300",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const constraintsRef = useRef(null)

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setDirection(1)
      setCurrentSlide(currentSlide + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100 && currentSlide < onboardingSlides.length - 1) {
      nextSlide()
    } else if (info.offset.x > 100 && currentSlide > 0) {
      prevSlide()
    }
  }

  const completeOnboarding = () => {
    localStorage.setItem("hasSeenOnboarding", "true")
    // router.push("/auth/login")
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          ref={constraintsRef}
          className="w-full max-w-md overflow-hidden"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center justify-center mb-6 gap-2">
                <img src="/icons/icon.png" alt="Calendarix Logo" className="size-15 rounded-xl" />
                <h1 className="text-xl font-bold ">Calendarix</h1>
              </div>

              <div className="mb-8 relative w-64 h-64">
                <Image
                  src={onboardingSlides[currentSlide].image || "/placeholder.svg"}
                  alt={onboardingSlides[currentSlide].title}
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold mb-4">{onboardingSlides[currentSlide].title}</h1>
              <p className="text-muted-foreground mb-8">{onboardingSlides[currentSlide].description}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mt-4 mb-8">
          {onboardingSlides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${currentSlide === index ? "w-8 bg-indigo-600" : "w-2 bg-muted"
                }`}
            />
          ))}
        </div>

        <div className="flex w-full justify-between">
          {currentSlide > 0 ? (
            <Button variant="ghost" onClick={prevSlide}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button onClick={nextSlide} className="bg-indigo-600 hover:bg-indigo-700">
            {currentSlide < onboardingSlides.length - 1 ? (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
