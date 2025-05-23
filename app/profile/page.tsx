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
      <div className="bg-[#D8CCFA] p-6 flex flex-col items-center">
        <div className="relative mb-3">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-[#B8E6F1]">
            <Image src={user.avatar || "/avatar.png"} alt="Profile" width={96} height={96} className="object-cover" />
          </div>
          <button
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md"
            onClick={() => router.push("/profile/edit")}
          >
            <Edit2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <h2 className="text-xl font-medium">{user.username}</h2>
        <p className="text-gray-600 text-sm">{user.email}</p>
        <div className="flex items-center mt-2">
          <div className="w-5 h-5 bg-[#5C6BC0] rounded flex items-center justify-center mr-1">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="text-xs text-gray-600">Calendarix</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xs mx-4 mt-4 overflow-hidden">
        <button className="w-full flex items-center p-4 hover:bg-gray-50" onClick={() => router.push("/profile/edit")}>
          <User className="h-5 w-5 text-gray-500 mr-3" />
          <span className="text-gray-700">Edite Profile</span>
        </button>
        <div className="border-t border-gray-100"></div>
        <button
          className="w-full flex items-center p-4 hover:bg-gray-50"
          onClick={() => router.push("/profile/privacy")}
        >
          <Lock className="h-5 w-5 text-gray-500 mr-3" />
          <span className="text-gray-700">Privacy Policy</span>
        </button>
      </div>

      <BottomNav currentPath="/profile" />
    </div>
  )
}
