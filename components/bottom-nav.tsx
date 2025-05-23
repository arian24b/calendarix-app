"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calendar, Clock, LayoutGrid, FileText, User } from "lucide-react"

interface BottomNavProps {
  currentPath: string
}

export function BottomNav({ currentPath }: BottomNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        <button
          onClick={() => router.push("/categories")}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full transition-colors",
            pathname.includes("/categories") || pathname.includes("/category") ? "text-[#4355B9]" : "text-gray-500",
          )}
        >
          <LayoutGrid className="h-5 w-5" />
          <span className="text-xs mt-1">Categories</span>
        </button>

        <button
          onClick={() => router.push("/clock")}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full transition-colors",
            pathname.includes("/clock") ? "text-[#4355B9]" : "text-gray-500",
          )}
        >
          <Clock className="h-5 w-5" />
          <span className="text-xs mt-1">Clock</span>
        </button>

        <button
          onClick={() => router.push("/calendar")}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full transition-colors",
            pathname.includes("/calendar") ? "text-[#4355B9]" : "text-gray-500",
          )}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Calendar</span>
        </button>

        <button
          onClick={() => router.push("/events")}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full transition-colors",
            pathname === "/events" ? "text-[#4355B9]" : "text-gray-500",
          )}
        >
          <FileText className="h-5 w-5" />
          <span className="text-xs mt-1">Events</span>
        </button>

        <button
          onClick={() => router.push("/profile")}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full transition-colors",
            pathname.includes("/profile") ? "text-[#4355B9]" : "text-gray-500",
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  )
}
