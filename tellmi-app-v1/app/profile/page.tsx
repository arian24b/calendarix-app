import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { BottomNavigation } from "@/components/ui/bottom-navigation"

export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="flex-1 pb-20">
        <div className="bg-gradient-to-r from-purple to-secondary p-6 pt-10 pb-16 rounded-b-3xl">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white mb-3">
              <Image
                src="/placeholder.svg?height=96&width=96"
                alt="Profile"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <h1 className="text-xl font-bold text-white">Jessica Thompson</h1>
            <p className="text-white/80">jessica@example.com</p>
          </div>
        </div>

        <div className="px-4 -mt-10">
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <h2 className="text-lg font-bold mb-4">Account</h2>

            <div className="space-y-3">
              <Link href="/profile/personal-info" className="flex justify-between items-center p-2">
                <span className="font-medium">Personal Information</span>
                <ChevronRight className="w-5 h-5 text-slate" />
              </Link>

              <Link href="/profile/notifications" className="flex justify-between items-center p-2">
                <span className="font-medium">Notifications</span>
                <ChevronRight className="w-5 h-5 text-slate" />
              </Link>

              <Link href="/profile/privacy" className="flex justify-between items-center p-2">
                <span className="font-medium">Privacy & Security</span>
                <ChevronRight className="w-5 h-5 text-slate" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <h2 className="text-lg font-bold mb-4">Preferences</h2>

            <div className="space-y-3">
              <Link href="/profile/appearance" className="flex justify-between items-center p-2">
                <span className="font-medium">Appearance</span>
                <ChevronRight className="w-5 h-5 text-slate" />
              </Link>

              <Link href="/profile/language" className="flex justify-between items-center p-2">
                <span className="font-medium">Language</span>
                <ChevronRight className="w-5 h-5 text-slate" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-bold mb-4">Support</h2>

            <div className="space-y-3">
              <Link href="/help" className="flex justify-between items-center p-2">
                <span className="font-medium">Help Center</span>
                <ChevronRight className="w-5 h-5 text-slate" />
              </Link>

              <Link href="/contact" className="flex justify-between items-center p-2">
                <span className="font-medium">Contact Us</span>
                <ChevronRight className="w-5 h-5 text-slate" />
              </Link>

              <button className="w-full flex justify-between items-center p-2 text-left text-red-500 font-medium">
                <span>Log Out</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  )
}

