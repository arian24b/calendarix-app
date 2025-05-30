"use client"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const Onboarding = () => {
  const [step, setStep] = useState(1)
  const router = useRouter()

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding")
    const token = localStorage.getItem("token")

    if (hasCompletedOnboarding === "true") {
      if (token) {
        router.push("/calendar")
      } else {
        router.push("/auth/login")
      }
    }
  }, [router])

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasCompletedOnboarding", "true")
    const token = localStorage.getItem("token")

    if (token) {
      router.push("/calendar")
    } else {
      router.push("/auth/login")
    }
  }

  return (
    <div>
      <h1>Onboarding</h1>
      {step === 1 && (
        <div>
          <h2>Step 1: Welcome!</h2>
          <p>Tell us about yourself.</p>
          <button onClick={nextStep}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Step 2: Preferences</h2>
          <p>What are your preferences?</p>
          <button onClick={prevStep}>Previous</button>
          <button onClick={nextStep}>Next</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>Step 3: Almost Done!</h2>
          <p>Finalize your profile.</p>
          <button onClick={prevStep}>Previous</button>
          <button onClick={handleOnboardingComplete}>Complete Onboarding</button>
        </div>
      )}
    </div>
  )
}

export default Onboarding
