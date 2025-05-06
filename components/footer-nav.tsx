"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { AlarmClock, Calendar, Plus, User } from "lucide-react"

interface FooterNavProps {
  currentPath: string
}

export function FooterNav({ currentPath }: FooterNavProps) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showAddSheet, setShowAddSheet] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false)
      } else {
        setVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-background border-t z-50 transition-transform duration-300",
          !visible && "translate-y-full",
        )}
      >
        <div className="flex items-center justify-around h-16">
          <Link href="/alarm">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "flex flex-col items-center justify-center h-16 w-16 rounded-none",
                pathname === "/alarm" && "text-primary",
              )}
            >
              <AlarmClock className="h-5 w-5" />
              <span className="text-xs mt-1">Alarm</span>
            </Button>
          </Link>
          <Link href="/calendar">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "flex flex-col items-center justify-center h-16 w-16 rounded-none",
                pathname === "/calendar" && "text-primary",
              )}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs mt-1">Calendar</span>
            </Button>
          </Link>
          <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="flex items-center justify-center h-12 w-12 rounded-full absolute -top-6 left-1/2 transform -translate-x-1/2 shadow-lg"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[30vh]">
              <div className="grid grid-cols-2 gap-4 pt-8">
                <Link href="/alarm" onClick={() => setShowAddSheet(false)}>
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
                    <AlarmClock className="h-8 w-8 mb-2" />
                    <span>New Alarm</span>
                  </Button>
                </Link>
                <Link href="/calendar" onClick={() => setShowAddSheet(false)}>
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
                    <Calendar className="h-8 w-8 mb-2" />
                    <span>New Event</span>
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-16"></div> {/* Spacer for center button */}
          <Link href="/profile">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "flex flex-col items-center justify-center h-16 w-16 rounded-none",
                pathname === "/profile" && "text-primary",
              )}
            >
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
