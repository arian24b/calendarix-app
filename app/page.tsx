"use client"

import { useEffect, useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Users, Zap, Shield, Smartphone } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Check if user has seen splash before (for returning users)
    const hasSeenSplash = localStorage.getItem("hasSeenSplash")

    if (hasSeenSplash) {
      setShowSplash(false)
    } else {
      // Show splash for first-time users
      const timer = setTimeout(() => {
        setShowSplash(false)
        localStorage.setItem("hasSeenSplash", "true")
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-purple-600 via-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-24 mx-auto max-w-7xl lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-sm"></div>
                  <div className="w-2.5 h-2.5 bg-blue-400 rounded-sm"></div>
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div>
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-sm"></div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Welcome to Calendarix</h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Organize your life with our powerful calendar, task management, and reminder system. Stay productive and
              never miss an important moment.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/calendar">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Get Started
                </Button>
              </Link>
              <Link href="/test">
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                  Test Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to stay organized
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Powerful features designed to help you manage your time effectively and boost productivity.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle>Smart Calendar</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Intuitive calendar interface with event management, recurring events, and smart scheduling.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                      <CardTitle>Alarms & Reminders</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Never miss important events with customizable alarms, notifications, and smart reminders.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Smartphone className="w-6 h-6 text-green-600" />
                      </div>
                      <CardTitle>PWA Ready</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Install as a native app on your device. Works offline and syncs when you're back online.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Users className="w-6 h-6 text-orange-600" />
                      </div>
                      <CardTitle>Team Collaboration</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Share calendars, collaborate on events, and keep your team synchronized and productive.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Zap className="w-6 h-6 text-red-600" />
                      </div>
                      <CardTitle>Lightning Fast</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Optimized performance with instant loading, smooth animations, and responsive design.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Shield className="w-6 h-6 text-indigo-600" />
                      </div>
                      <CardTitle>Secure & Private</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Your data is encrypted and secure. We respect your privacy and never share your information.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-linear-to-r from-purple-600 to-blue-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to get organized?</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Join thousands of users who have transformed their productivity with Calendarix.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/calendar">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Start Using Calendarix
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
