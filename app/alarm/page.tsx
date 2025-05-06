"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Bell, Plus, Trash2 } from "lucide-react"
import { FooterNav } from "@/components/footer-nav"
import { TimePickerDemo } from "@/components/time-picker"
// Import the alarm service
import { getAlarms, addAlarm, updateAlarm, deleteAlarm, toggleAlarm, type Alarm } from "@/lib/alarm-service"

// Mock data for alarms
const initialAlarms = [
  {
    id: "1",
    time: "07:30",
    label: "Wake up",
    isActive: true,
    repeat: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    sound: "Chimes",
  },
  {
    id: "2",
    time: "08:15",
    label: "Take medication",
    isActive: true,
    repeat: ["Every day"],
    sound: "Beacon",
  },
  {
    id: "3",
    time: "17:30",
    label: "Evening workout",
    isActive: false,
    repeat: ["Mon", "Wed", "Fri"],
    sound: "Radar",
  },
]

const alarmSchema = z.object({
  time: z.string(),
  label: z.string().optional(),
  repeat: z.array(z.string()).default([]),
  sound: z.string().default("Chimes"),
})

export default function AlarmPage() {
  const router = useRouter()
  // Update the useState to use an empty array initially
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [showAddAlarm, setShowAddAlarm] = useState(false)
  const [editingAlarm, setEditingAlarm] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("08:00")

  const form = useForm<z.infer<typeof alarmSchema>>({
    resolver: zodResolver(alarmSchema),
    defaultValues: {
      time: "08:00",
      label: "",
      repeat: [],
      sound: "Chimes",
    },
  })

  // Update the useEffect to load alarms from localStorage
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // Load alarms from localStorage
    setAlarms(getAlarms())
  }, [router])

  // Update the onSubmit function to use the alarm service
  const onSubmit = (values: z.infer<typeof alarmSchema>) => {
    if (editingAlarm) {
      // Update existing alarm
      const updatedAlarms = updateAlarm(editingAlarm, {
        time: selectedTime,
        label: values.label || "Alarm",
        repeat: values.repeat.length ? values.repeat : ["Once"],
        sound: values.sound,
        isActive: true,
      })
      setAlarms(updatedAlarms)
      toast.success("Alarm updated")
    } else {
      // Add new alarm
      const newAlarm: Alarm = {
        id: Date.now().toString(),
        time: selectedTime,
        label: values.label || "Alarm",
        isActive: true,
        repeat: values.repeat.length ? values.repeat : ["Once"],
        sound: values.sound,
      }
      const updatedAlarms = addAlarm(newAlarm)
      setAlarms(updatedAlarms)
      toast.success("Alarm added")
    }

    setShowAddAlarm(false)
    setEditingAlarm(null)
    form.reset()
  }

  // Update the toggleAlarm function to use the alarm service
  const handleToggleAlarm = (id: string) => {
    const updatedAlarms = toggleAlarm(id)
    setAlarms(updatedAlarms)
  }

  // Update the deleteAlarm function to use the alarm service
  const handleDeleteAlarm = (id: string) => {
    const updatedAlarms = deleteAlarm(id)
    setAlarms(updatedAlarms)
    toast.success("Alarm deleted")
  }

  const editAlarm = (id: string) => {
    const alarm = alarms.find((a) => a.id === id)
    if (alarm) {
      form.reset({
        time: alarm.time,
        label: alarm.label,
        repeat: alarm.repeat === ["Every day"] ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : alarm.repeat,
        sound: alarm.sound,
      })
      setSelectedTime(alarm.time)
      setEditingAlarm(id)
      setShowAddAlarm(true)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Alarms</h1>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setEditingAlarm(null)
            form.reset()
            setShowAddAlarm(true)
          }}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 p-4">
        {alarms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No alarms set</h2>
            <p className="text-muted-foreground mb-4">Tap the + button to add your first alarm</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="flex items-center justify-between p-4 border rounded-lg relative group"
                onClick={() => editAlarm(alarm.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <h2 className={`text-2xl font-semibold ${!alarm.isActive ? "text-muted-foreground" : ""}`}>
                      {alarm.time}
                    </h2>
                    <div className="ml-auto">
                      <Switch
                        checked={alarm.isActive}
                        onCheckedChange={() => handleToggleAlarm(alarm.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <p className={`text-sm ${!alarm.isActive ? "text-muted-foreground" : ""}`}>{alarm.label}</p>
                  <p className="text-xs text-muted-foreground">{alarm.repeat.join(", ")}</p>
                </div>
                <div
                  className="absolute right-0 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteAlarm(alarm.id)
                  }}
                >
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Sheet open={showAddAlarm} onOpenChange={setShowAddAlarm}>
        <SheetContent side="bottom" className="h-[90vh] sm:h-[70vh]">
          <SheetHeader>
            <SheetTitle>{editingAlarm ? "Edit Alarm" : "Add Alarm"}</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-center py-4">
                  <TimePickerDemo value={selectedTime} onChange={setSelectedTime} />
                </div>

                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Alarm label" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="repeat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat</FormLabel>
                      <div className="grid grid-cols-7 gap-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                          <Button
                            key={day}
                            type="button"
                            variant={field.value.includes(day) ? "default" : "outline"}
                            className="h-10 w-10 p-0"
                            onClick={() => {
                              const newValue = field.value.includes(day)
                                ? field.value.filter((d) => d !== day)
                                : [...field.value, day]
                              form.setValue("repeat", newValue)
                            }}
                          >
                            {day.charAt(0)}
                          </Button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sound"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sound</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sound" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Chimes">Chimes</SelectItem>
                          <SelectItem value="Radar">Radar</SelectItem>
                          <SelectItem value="Beacon">Beacon</SelectItem>
                          <SelectItem value="Signal">Signal</SelectItem>
                          <SelectItem value="Waves">Waves</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {editingAlarm ? "Update Alarm" : "Add Alarm"}
                </Button>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>

      <FooterNav currentPath="/alarm" />
    </div>
  )
}
