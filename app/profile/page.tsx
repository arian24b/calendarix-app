"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Bell, Camera, ChevronRight, LogOut, Moon, User } from "lucide-react"
import { FooterNav } from "@/components/footer-nav"
import { useTheme } from "next-themes"
import { getCurrentUser, updateProfile } from "@/lib/actions/user-actions"

// Mock user data
// const mockUser = {
//   id: "1",
//   username: "johndoe",
//   email: "john.doe@example.com",
//   phone: "+1 (555) 123-4567",
//   avatar: "/placeholder.svg?height=100&width=100",
// }

const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  phone: z.string().optional(),
})

export default function ProfilePage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      phone: "",
    },
  })

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // Fetch user profile from API
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const userData = await getCurrentUser()
        setUser(userData)
        form.reset({
          username: userData.username,
          phone: userData.phone || "",
        })
      } catch (error) {
        toast.error("Failed to load profile")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [router, form])

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      // Update profile via API
      await updateProfile({
        username: values.username,
        phone: values.phone,
      })

      // Update local state
      setUser({
        ...user,
        ...values,
      })

      toast.success("Profile updated")
      setShowEditProfile(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    toast.success("Logged out successfully")
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Profile</h1>
      </div>

      <div className="flex-1 p-4">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-muted">
              <Image
                src={user.avatar || "/placeholder.svg"}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg divide-y">
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setShowEditProfile(true)}
            >
              <div className="flex items-center">
                <User className="h-5 w-5 text-muted-foreground mr-3" />
                <span>Edit Profile</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-muted-foreground mr-3" />
                <span>Notifications</span>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Moon className="h-5 w-5 text-muted-foreground mr-3" />
                <span>Dark Mode</span>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            </div>
          </div>

          <Button variant="destructive" className="w-full" onClick={() => setShowLogoutConfirm(true)}>
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>

      <Sheet open={showEditProfile} onOpenChange={setShowEditProfile}>
        <SheetContent side="bottom" className="h-[70vh]">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>You will need to log in again to access your account.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FooterNav currentPath="/profile" />
    </div>
  )
}
