"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { BottomNav } from "@/components/bottom-nav"
import { getCurrentUser, updateProfile } from "@/lib/services/user-service"

export default function EditProfilePage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("Puerto Rico")
  const [nickName, setNickName] = useState("puerto_rico")
  const [email, setEmail] = useState("youremail@domain.com")
  const [country, setCountry] = useState("USA")
  const [gender, setGender] = useState("Female")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")

    // Fetch user profile if authenticated
    if (token) {
      const fetchUserProfile = async () => {
        try {
          setLoading(true)
          const userData = await getCurrentUser()
          setFullName(userData.fullName || userData.username || "Puerto Rico")
          setNickName(userData.nickName || userData.username?.toLowerCase() || "puerto_rico")
          setEmail(userData.email || "youremail@domain.com")
          setCountry(userData.country || "USA")
          setGender(userData.gender || "Female")
        } catch (error) {
          console.error(error)
          // If API call fails, keep default values
        } finally {
          setLoading(false)
        }
      }

      fetchUserProfile()
    } else {
      // Not authenticated, use default values
      setLoading(false)
    }
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)

      // Check if user is authenticated
      const token = localStorage.getItem("token")

      if (token) {
        // Update profile via API
        await updateProfile({
          username: fullName,
          // Add other fields as needed by your API
        })
        toast.success("Profile updated successfully")
      } else {
        // Store in localStorage for non-authenticated users
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            fullName,
            nickName,
            email,
            country,
            gender,
          }),
        )
        toast.success("Profile updated successfully")
      }

      router.push("/profile")
    } catch (error) {
      console.error(error)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <div className="p-4 flex items-center border-b">
        <button onClick={() => router.back()} className="mr-4">
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-medium flex-1 text-center">Edite Profile</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      <div className="p-4 flex-1">
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">FULL NAME</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="border-gray-300" />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-1 block">NICK NAME</Label>
            <Input value={nickName} onChange={(e) => setNickName(e.target.value)} className="border-gray-300" />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-1 block">EMAIL</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-gray-300" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">COUNTRY</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                  <SelectItem value="China">China</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Brazil">Brazil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-500 mb-1 block">GENRE</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Button className="w-full bg-[#4355B9] hover:bg-[#3A4A9F] py-6" onClick={handleSave} disabled={saving}>
          {saving ? "SAVING..." : "SAVE"}
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
