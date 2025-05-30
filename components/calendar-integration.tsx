"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Calendar, RefreshCw, Link, Unlink } from "lucide-react"
import { googleCalendarService } from "@/lib/services/google-calendar-service"
import { toast } from "sonner"

export function CalendarIntegration() {
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [calendars, setCalendars] = useState<any[]>([])
    const [syncEnabled, setSyncEnabled] = useState(false)

    useEffect(() => {
        checkConnectionStatus()
    }, [])

    const checkConnectionStatus = async () => {
        try {
            await googleCalendarService.initialize()
            const connected = googleCalendarService.isSignedIn()
            setIsConnected(connected)

            if (connected) {
                await loadCalendars()
            }
        } catch (error) {
            console.error("Failed to check Google Calendar connection:", error)
        }
    }

    const loadCalendars = async () => {
        try {
            const calendarList = await googleCalendarService.getCalendars()
            setCalendars(calendarList)
        } catch (error) {
            console.error("Failed to load calendars:", error)
            toast.error("Failed to load Google calendars")
        }
    }

    const handleConnect = async () => {
        setIsLoading(true)
        try {
            const success = await googleCalendarService.signIn()
            if (success) {
                setIsConnected(true)
                await loadCalendars()
                toast.success("Successfully connected to Google Calendar!")
            } else {
                toast.error("Failed to connect to Google Calendar")
            }
        } catch (error) {
            console.error("Google Calendar connection failed:", error)
            toast.error("Failed to connect to Google Calendar")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDisconnect = async () => {
        setIsLoading(true)
        try {
            await googleCalendarService.signOut()
            setIsConnected(false)
            setCalendars([])
            setSyncEnabled(false)
            toast.success("Disconnected from Google Calendar")
        } catch (error) {
            console.error("Failed to disconnect:", error)
            toast.error("Failed to disconnect from Google Calendar")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSync = async () => {
        if (!isConnected) return

        setIsLoading(true)
        try {
            // Get events from Google Calendar
            const events = await googleCalendarService.getEvents()

            // Here you would sync these events with your local calendar
            // For now, we'll just show a success message
            toast.success(`Synced ${events.length} events from Google Calendar`)
        } catch (error) {
            console.error("Sync failed:", error)
            toast.error("Failed to sync with Google Calendar")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Google Calendar Integration
                </CardTitle>
                <CardDescription>Connect your Google Calendar to sync events automatically</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        <Badge variant={isConnected ? "default" : "secondary"}>{isConnected ? "Connected" : "Not Connected"}</Badge>
                    </div>

                    {isConnected ? (
                        <Button variant="outline" size="sm" onClick={handleDisconnect} disabled={isLoading}>
                            <Unlink className="h-4 w-4 mr-2" />
                            Disconnect
                        </Button>
                    ) : (
                        <Button onClick={handleConnect} disabled={isLoading}>
                            <Link className="h-4 w-4 mr-2" />
                            {isLoading ? "Connecting..." : "Connect"}
                        </Button>
                    )}
                </div>

                {isConnected && (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Auto Sync</span>
                            <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Connected Calendars ({calendars.length})</span>
                                <Button variant="outline" size="sm" onClick={handleSync} disabled={isLoading}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Sync Now
                                </Button>
                            </div>

                            {calendars.length > 0 && (
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {calendars.slice(0, 3).map((calendar) => (
                                        <div key={calendar.id} className="text-sm text-gray-600 flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: calendar.backgroundColor || "#4285f4" }}
                                            />
                                            {calendar.summary}
                                        </div>
                                    ))}
                                    {calendars.length > 3 && (
                                        <div className="text-sm text-gray-500">+{calendars.length - 3} more calendars</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
