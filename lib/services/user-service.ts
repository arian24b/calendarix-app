import { userAPI, APIRequestError } from "../api-client"
import type { ProfileUpdate } from "../types/api"

interface User {
  id: number
  username: string
  email: string
  phone?: string
  fullName?: string
  nickName?: string
  country?: string
  gender?: string
  is_active: boolean
  is_admin: boolean
  created_at: string
  updated_at?: string
  avatar?: string
}

// Check if we're in a preview/demo environment
function isPreviewEnvironment(): boolean {
  return (
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL.includes("localhost") ||
    (typeof window !== "undefined" && window.location.hostname.includes("v0.dev"))
  )
}

// Get stored user info from localStorage
function getStoredUserInfo(): Partial<User> | null {
  if (typeof window === "undefined") return null

  const storedInfo = localStorage.getItem("userInfo")
  if (storedInfo) {
    try {
      return JSON.parse(storedInfo)
    } catch (e) {
      return null
    }
  }
  return null
}

export async function getCurrentUser(): Promise<User> {
  try {
    const userData = await userAPI.getCurrentUser()
    return userData
  } catch (error) {
    if (error instanceof APIRequestError) {
      console.error("API Error:", error.detail)

      // If API fails, try to get from localStorage
      const storedProfile = localStorage.getItem("userProfile")
      const storedInfo = getStoredUserInfo()

      if (storedProfile || storedInfo) {
        const profile = storedProfile ? JSON.parse(storedProfile) : {}
        return {
          id: 0,
          username: profile.fullName || storedInfo?.username || "Demo User",
          email: profile.email || storedInfo?.email || "demo@example.com",
          fullName: profile.fullName || storedInfo?.username || "Demo User",
          nickName: profile.nickName || storedInfo?.username?.toLowerCase() || "demo_user",
          country: profile.country || "USA",
          gender: profile.gender || "Other",
          is_active: true,
          is_admin: false,
          created_at: storedInfo?.created_at || new Date().toISOString(),
          avatar: "/avatar.png",
        }
      }
    }

    // Default profile if everything fails
    return {
      id: 0,
      username: "Demo User",
      email: "demo@example.com",
      fullName: "Demo User",
      nickName: "demo_user",
      country: "USA",
      gender: "Other",
      is_active: true,
      is_admin: false,
      created_at: new Date().toISOString(),
      avatar: "/avatar.png",
    }
  }
}

export async function updateProfile(data: ProfileUpdate): Promise<User> {
  try {
    const updatedUser = await userAPI.updateProfile(data)
    return updatedUser
  } catch (error) {
    if (error instanceof APIRequestError) {
      console.error("API Error:", error.detail)

      // If API fails, update in localStorage
      const currentUser = await getCurrentUser()
      const updatedUser = { ...currentUser, ...data }

      localStorage.setItem(
        "userProfile",
        JSON.stringify({
          fullName: updatedUser.fullName || updatedUser.username,
          nickName: updatedUser.nickName || updatedUser.username?.toLowerCase(),
          email: updatedUser.email,
          country: updatedUser.country,
          gender: updatedUser.gender,
        }),
      )

      return updatedUser
    }
    throw error
  }
}

export async function deactivateAccount(): Promise<{ message: string }> {
  try {
    return await userAPI.deactivateAccount()
  } catch (error) {
    if (error instanceof APIRequestError) {
      throw new Error(error.detail)
    }
    throw error
  }
}

export async function generateApiKey(): Promise<{ api_key: string }> {
  try {
    return await userAPI.generateApiKey()
  } catch (error) {
    if (error instanceof APIRequestError) {
      throw new Error(error.detail)
    }
    throw error
  }
}
