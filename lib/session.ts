// Session management utilities
import { env } from "@/lib/config";

export async function getCurrentUser() {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("No authentication token found")
  }

  try {
    // Make API call to get current user
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user data")
    }

    return await response.json()
  } catch (error) {
    // Fallback to default user data if API fails
    return {
      username: "Demo User",
      email: "demo@example.com",
      avatar: "/avatar.png",
    }
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("token")
}

export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  window.location.href = "/auth/login"
}
