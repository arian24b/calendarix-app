"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowDown, Check, ChevronRight, Smartphone } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function InstallPage() {
  const router = useRouter()
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if already installed
    if (typeof window !== "undefined") {
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches)

      // Detect iOS
      const ua = window.navigator.userAgent
      setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream)

      // Listen for beforeinstallprompt event
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault()
        // Stash the event so it can be triggered later
        setDeferredPrompt(e)
      })
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)

    if (outcome === "accepted") {
      toast({
        title: "Installation started",
        description: "App installation started",
      })
    }
  }

  const navigateToApp = () => {
    router.push("/alarm")
  }

  if (isStandalone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">App Already Installed</h1>
        <p className="text-muted-foreground mb-6">You're already using the installed app version.</p>
        <Button onClick={navigateToApp}>Continue to App</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Install App</h1>
      </div>

      <div className="flex-1 p-6">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 mb-6 relative">
            <Image
              src="/placeholder.svg?height=96&width=96"
              alt="TimeSync Logo"
              width={96}
              height={96}
              className="rounded-xl"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">TimeSync</h2>
          <p className="text-muted-foreground">Install TimeSync on your device for the best experience</p>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Benefits of installing:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                <span>Faster access with app icon on your home screen</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                <span>Works offline or with poor connections</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                <span>Full-screen experience without browser controls</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                <span>Get notifications for alarms and events</span>
              </li>
            </ul>
          </div>

          {isIOS ? (
            <div className="space-y-4">
              <h3 className="font-medium">Install on iOS:</h3>
              <div className="flex items-center">
                <div className="bg-muted p-2 rounded-lg mr-3">
                  <ArrowDown className="h-6 w-6" />
                </div>
                <p>Tap the Share button in Safari</p>
              </div>
              <div className="flex items-center">
                <div className="bg-muted p-2 rounded-lg mr-3">
                  <Smartphone className="h-6 w-6" />
                </div>
                <p>Tap "Add to Home Screen"</p>
              </div>
            </div>
          ) : (
            <Button className="w-full" onClick={handleInstall} disabled={!deferredPrompt}>
              {deferredPrompt ? "Install App" : "Open in Chrome to Install"}
            </Button>
          )}

          <Button variant="outline" className="w-full" onClick={navigateToApp}>
            Continue to Web App
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
