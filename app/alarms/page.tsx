"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import type { Alarm } from "@/types"

const AlarmsPage = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchAlarms = async () => {
      if (!session?.user?.email) return

      try {
        const response = await fetch(`/api/alarms?email=${session.user.email}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setAlarms(data)
      } catch (error) {
        console.error("Could not fetch alarms:", error)
      }
    }

    fetchAlarms()
  }, [session])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h1 className="text-2xl font-semibold">Alarms</h1>
      </div>
      <div className="grow overflow-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {alarms.map((alarm) => (
            <div
              key={alarm.id}
              className="bg-white rounded-lg p-4 shadow-xs relative group"
              onClick={() => router.push(`/alarms/edit/${alarm.id}`)}
            >
              <h2 className="text-lg font-semibold">{alarm.name}</h2>
              <p className="text-gray-500">{alarm.time}</p>
              {/* Add more alarm details here */}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 flex justify-center">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          onClick={() => router.push("/alarms/create")}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

export default AlarmsPage
