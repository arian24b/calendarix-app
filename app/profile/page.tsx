"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Edit2, User, Lock } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { getCurrentUser } from "@/lib/services/user-service"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)

    // Set default user data for non-authenticated users
    if (!token) {
      setUser({
        username: "Puerto Rico",
        email: "youremail@domain.com",
        avatar: "/avatar.png",
      })
      setLoading(false)
      return
    }

    // Fetch user profile from API for authenticated users
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error(error)
        // If API call fails, set as guest user
        setUser({
          username: "Puerto Rico",
          email: "youremail@domain.com",
          avatar: "/avatar.png",
        })
        // Clear invalid token
        localStorage.removeItem("token")
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-gray-800 font-medium">Edit Profile</span>
          </button>

          <button
            className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors"
            onClick={() => window.open("https://calendarix.pro/policy/", "_blank")}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
              <Lock className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-gray-800 font-medium">Privacy Policy</span>
          </button>
        </div>
      </div>

      <BottomNav currentPath="/profile" />
    </div>
  )
}
