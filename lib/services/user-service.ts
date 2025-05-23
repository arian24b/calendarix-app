import { apiRequest } from "../api-client"

interface ProfileUpdate {
  username?: string
  phone?: string
  fullName?: string
  nickName?: string
  country?: string
  gender?: string
}

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

interface ApiKeyResponse {
  api_key: string
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
  // If in preview environment, return mock data
  if (isPreviewEnvironment()) {
    // Check if we have stored user info first
    const storedInfo = getStoredUserInfo()

    // Return mock or stored user data
    return {
      id: 1,
      username: storedInfo?.username || "Puerto Rico",
      email: storedInfo?.email || "youremail@domain.com",
      fullName: storedInfo?.fullName || "Puerto Rico",
      nickName: storedInfo?.nickName || "puerto_rico",
      country: storedInfo?.country || "USA",
      gender: storedInfo?.gender || "Female",
      is_active: true,
      is_admin: false,
      created_at: storedInfo?.created_at || new Date().toISOString(),
      avatar: "/avatar.png",
    }
  }

  // Try to get from API
  try {
    return await apiRequest<User>({
      method: "GET",
      path: "/v1/user/me",
      requiresAuth: true,
    })
  } catch (error) {
    // If API fails, try to get from localStorage
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      const profile = JSON.parse(storedProfile)
      return {
        id: 0,
        username: profile.fullName || "Puerto Rico",
        email: profile.email || "youremail@domain.com",
        fullName: profile.fullName || "Puerto Rico",
        nickName: profile.nickName || "puerto_rico",
        country: profile.country || "USA",
        gender: profile.gender || "Female",
        is_active: true,
        is_admin: false,
        created_at: new Date().toISOString(),
        avatar: "/avatar.png",
      }
    }

    // Default profile if nothing is found
    return {
      id: 0,
      username: "Puerto Rico",
      email: "youremail@domain.com",
      fullName: "Puerto Rico",
      nickName: "puerto_rico",
      country: "USA",
      gender: "Female",
      is_active: true,
      is_admin: false,
      created_at: new Date().toISOString(),
      avatar: "/avatar.png",
    }
  }
}

export async function updateProfile(data: ProfileUpdate): Promise<User> {
  // If in preview environment, update stored user info
  if (isPreviewEnvironment()) {
    const currentUser = await getCurrentUser()
    const updatedUser = { ...currentUser, ...data }

    // Store updated info
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        nickName: updatedUser.nickName,
        country: updatedUser.country,
        gender: updatedUser.gender,
        created_at: updatedUser.created_at,
      }),
    )

    return updatedUser
  }

  try {
    return await apiRequest<User>({
      method: "PUT",
      path: "/v1/user/profile",
      body: data,
      requiresAuth: true,
    })
  } catch (error) {
    // If API fails, update in localStorage
    const currentProfile = await getCurrentUser()
    const updatedProfile = { ...currentProfile, ...data }

    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        fullName: updatedProfile.fullName || updatedProfile.username,
        nickName: updatedProfile.nickName || updatedProfile.username?.toLowerCase(),
        email: updatedProfile.email,
        country: updatedProfile.country,
        gender: updatedProfile.gender,
      }),
    )

    return updatedProfile
  }
}

export async function deactivateAccount(): Promise<{ message: string }> {
  if (isPreviewEnvironment()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { message: "Account deactivated successfully (mock)" }
  }

  return apiRequest<{ message: string }>({
    method: "POST",
    path: "/v1/user/deactivate",
    requiresAuth: true,
  })
}

export async function generateApiKey(): Promise<ApiKeyResponse> {
  if (isPreviewEnvironment()) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { api_key: "mock_api_key_" + Date.now() }
  }

  return apiRequest<ApiKeyResponse>({
    method: "POST",
    path: "/v1/user/generate-api-key",
    requiresAuth: true,
  })
}
