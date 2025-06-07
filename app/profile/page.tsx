"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Edit2, UserIcon, Lock, Settings, LogOut } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { authService, type User } from "@/lib/services/auth-service"
import { CalendarIntegration } from "@/components/calendar-integration"
import {
  ActionSheet,
  ActionSheetContent,
  ActionSheetHeader,
  ActionSheetTitle,
  ActionSheetItem,
  ActionSheetSeparator,
  ActionSheetTrigger
} from "@/components/ui/action-sheet"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")

    // If not authenticated, redirect to login
    if (!token) {
      router.replace("/auth")
      return
    }

    // Fetch user profile from API for authenticated users
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const userData = await authService.getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
        // Clear invalid token and redirect to login
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.replace("/auth")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [router])

  const handleLogout = async () => {
    try {
      await authService.logout()
      toast.success("Logged out successfully")
      router.replace("/auth")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load user profile</p>
          <button
            onClick={() => router.replace("/auth")}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* Purple Header Section */}
      <div className="bg-linear-to-br from-[#B8A9E8] to-[#D8CCFA] px-6 py-8 flex flex-col items-center relative">
        <div className="relative mb-4">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-white shadow-lg">
            <Image
              src={user.avatar || "/avatar.png"}
              alt="Profile"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <button
            className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md"
            onClick={() => router.push("/profile/edit")}
          >
            <Edit2 className="h-3 w-3 text-gray-600" />
          </button>
        </div>
        <h2 className="text-xl font-medium text-gray-800 mb-1">{user.username}</h2>
        <p className="text-gray-600 text-sm mb-4">{user.email}</p>

        {/* Calendarix Badge */}
        <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
          <div className="w-5 h-5 bg-[#5C6BC0] rounded flex items-center justify-center mr-2">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="text-sm text-gray-700">Calendarix</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 bg-gray-50 px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            onClick={() => router.push("/profile/edit")}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
              <UserIcon className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-gray-800 font-medium">Edit Profile</span>
          </button>

          <button
            className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            onClick={() => window.open("https://calendarix.pro/policy/", "_blank")}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
              <Lock className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-gray-800 font-medium">Privacy Policy</span>
          </button>

          <ActionSheet>
            <ActionSheetTrigger asChild>
              <button className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <Settings className="h-5 w-5 text-gray-600" />
                </div>
                <span className="text-gray-800 font-medium">Settings</span>
              </button>
            </ActionSheetTrigger>
            <ActionSheetContent>
              <ActionSheetHeader>
                <ActionSheetTitle>Settings</ActionSheetTitle>
              </ActionSheetHeader>
              <div className="space-y-0">
                <ActionSheetItem onClick={() => router.push("/profile/edit")}>
                  <UserIcon className="h-5 w-5 mr-3" />
                  Edit Profile
                </ActionSheetItem>
                <ActionSheetSeparator />
                <ActionSheetItem onClick={() => window.open("https://calendarix.pro/policy/", "_blank")}>
                  <Lock className="h-5 w-5 mr-3" />
                  Privacy Policy
                </ActionSheetItem>
                <ActionSheetSeparator />
                <ActionSheetItem destructive onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </ActionSheetItem>
              </div>
            </ActionSheetContent>
          </ActionSheet>
        </div>

        {/* Google Calendar Integration */}
        <div className="mt-6">
          <CalendarIntegration />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
