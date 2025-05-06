import { api } from "@/lib/api-client"

export async function getCurrentUser() {
  return api.get("/v1/user/me")
}

export async function updateProfile(profileData: { username: string; phone?: string }) {
  return api.put("/v1/user/profile", profileData)
}
