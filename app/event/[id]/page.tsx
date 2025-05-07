"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Pencil } from "lucide-react"
import { FooterNav } from "@/components/footer-nav"
import { DateTimePicker } from "@/components/date-time-picker"

// Mock data for events
const mockEvents = [
  {
    id: "1",
    title: "Team Meeting",
    start: new Date(2025, 4, 6, 10, 0),
    end: new Date(2025, 4, 6, 11, 30),
    location: "Conference Room A",
    description: "Weekly team sync to discuss project progress and blockers.",
  },
  {
    id: "2",
    title: "Doctor Appointment",
    start: new Date(2025, 4, 8, 14, 0),
    end: new Date(2025, 4, 8, 15, 0),
    location: "City Medical Center",
    description: "Annual checkup with Dr. Smith.",
  },
  {
    id: "3",
    title: "Birthday Party",
    start: new Date(2025, 4, 12, 18, 0),
    end: new Date(2025, 4, 12, 22, 0),
    location: "Riverside Park",
    description: "Sarah's birthday celebration. Bring a gift!",
  },
]

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  start: z.date(),
  end: z.date().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
})

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<any>(null)
  const [showEditEvent, setShowEditEvent] = useState(false)
  const [loading, setLoading] = useState(true)

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      start: new Date(),
    },
  })

  useEffect(() => {
    // Check if user is authenticated
    // const token = localStorage.getItem("token")
    // if (!token) {
    //   router.push("/auth/login")
    //   return
    // }

    // Fetch event details
    const foundEvent = mockEvents.find((e) => e.id === eventId)
    if (foundEvent) {
      setEvent(foundEvent)
      form.reset({
        title: foundEvent.title,
        start: foundEvent.start,
        end: foundEvent.end,
        location: foundEvent.location,
        description: foundEvent.description,
      })
    } else {
      toast.error("Event not found")
      router.push("/calendar")
    }
    setLoading(false)
  }, [eventId, router, form])

  const onSubmit = (values: z.infer<typeof eventSchema>) => {
    // Update event (in a real app, this would be an API call)
    setEvent({
      ...event,
      ...values,
    })

    toast.success("Event updated")
    setShowEditEvent(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button onClick={() => router.push("/calendar")}>Back to Calendar</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16">
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" onClick={() => router.push("/calendar")}>
          Back
        </Button>
        <h1 className="text-xl font-bold">Event Details</h1>
        <Button size="icon" variant="ghost" onClick={() => setShowEditEvent(true)}>
          <Pencil className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">{event.title}</h2>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{format(event.start, "EEEE, MMMM d, yyyy")}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <p>
                  {format(event.start, "h:mm a")} - {event.end ? format(event.end, "h:mm a") : ""}
                </p>
              </div>
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <p>{event.location}</p>
            </div>
          )}

          {event.description && (
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
          )}
        </div>
      </div>

      <Sheet open={showEditEvent} onOpenChange={setShowEditEvent}>
        <SheetContent side="bottom" className="h-[90vh] sm:h-[70vh]">
          <SheetHeader>
            <SheetTitle>Edit Event</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Event title" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start</FormLabel>
                      <FormControl>
                        <DateTimePicker date={field.value} setDate={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End (Optional)</FormLabel>
                      <FormControl>
                        <DateTimePicker date={field.value || undefined} setDate={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Event location" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Event description" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Update Event
                </Button>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>

      <FooterNav currentPath="/calendar" />
    </div>
  )
}
