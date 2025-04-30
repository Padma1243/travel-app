"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { useSession } from "@/components/session-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/components/ui/use-toast"

interface CalendarEvent {
  id: number
  title: string
  date: Date
  type: "activity" | "transportation" | "accommodation"
  itineraryId: string
  itineraryTitle: string
  location?: string
}

interface Itinerary {
  id: string
  title: string
  startDate: string
  endDate: string
}

export default function CalendarPage() {
  const { session } = useSession({ required: true })
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [selectedItinerary, setSelectedItinerary] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState<"month" | "list">("month")

  useEffect(() => {
    if (session) {
      fetchItineraries()
    }
  }, [session])

  useEffect(() => {
    if (session) {
      fetchEvents()
    }
  }, [session, currentDate, selectedItinerary])

  const fetchItineraries = async () => {
    try {
      const response = await fetch("/api/itineraries")
      if (!response.ok) {
        throw new Error("Failed to fetch itineraries")
      }
      const data = await response.json()
      setItineraries(data)
      setIsLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your itineraries",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      // In a real app, you would fetch events for the current month from your API
      // For this example, we'll generate some sample events
      const startDate = startOfMonth(currentDate)
      const endDate = endOfMonth(currentDate)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Generate sample events
      const sampleEvents: CalendarEvent[] = []

      // Add events from itineraries
      itineraries.forEach((itinerary) => {
        const itineraryStart = new Date(itinerary.startDate)
        const itineraryEnd = new Date(itinerary.endDate)

        // Skip if filtered by itinerary
        if (selectedItinerary !== "all" && selectedItinerary !== itinerary.id.toString()) {
          return
        }

        // Add trip start
        if (isSameMonth(itineraryStart, currentDate)) {
          sampleEvents.push({
            id: sampleEvents.length + 1,
            title: `${itinerary.title} Begins`,
            date: itineraryStart,
            type: "activity",
            itineraryId: itinerary.id,
            itineraryTitle: itinerary.title,
          })
        }

        // Add trip end
        if (isSameMonth(itineraryEnd, currentDate)) {
          sampleEvents.push({
            id: sampleEvents.length + 1,
            title: `${itinerary.title} Ends`,
            date: itineraryEnd,
            type: "activity",
            itineraryId: itinerary.id,
            itineraryTitle: itinerary.title,
          })
        }

        // Add some random events within the trip dates
        if (
          isSameMonth(itineraryStart, currentDate) ||
          isSameMonth(itineraryEnd, currentDate) ||
          (itineraryStart < startDate && itineraryEnd > endDate)
        ) {
          // Sample hotel check-in
          const checkInDate = new Date(itineraryStart)
          if (isSameMonth(checkInDate, currentDate)) {
            sampleEvents.push({
              id: sampleEvents.length + 1,
              title: "Hotel Check-in",
              date: checkInDate,
              type: "accommodation",
              itineraryId: itinerary.id,
              itineraryTitle: itinerary.title,
              location: "Grand Hotel",
            })
          }

          // Sample flight
          const flightDate = new Date(itineraryStart)
          flightDate.setDate(flightDate.getDate() - 1)
          if (isSameMonth(flightDate, currentDate)) {
            sampleEvents.push({
              id: sampleEvents.length + 1,
              title: "Flight to Destination",
              date: flightDate,
              type: "transportation",
              itineraryId: itinerary.id,
              itineraryTitle: itinerary.title,
              location: "International Airport",
            })
          }

          // Sample activity
          const activityDate = new Date(itineraryStart)
          activityDate.setDate(activityDate.getDate() + 2)
          if (isSameMonth(activityDate, currentDate)) {
            sampleEvents.push({
              id: sampleEvents.length + 1,
              title: "City Tour",
              date: activityDate,
              type: "activity",
              itineraryId: itinerary.id,
              itineraryTitle: itinerary.title,
              location: "City Center",
            })
          }

          // Sample return flight
          const returnDate = new Date(itineraryEnd)
          if (isSameMonth(returnDate, currentDate)) {
            sampleEvents.push({
              id: sampleEvents.length + 1,
              title: "Return Flight",
              date: returnDate,
              type: "transportation",
              itineraryId: itinerary.id,
              itineraryTitle: itinerary.title,
              location: "International Airport",
            })
          }
        }
      })

      setEvents(sampleEvents)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load calendar events",
        variant: "destructive",
      })
    }
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), day))
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "activity":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "transportation":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "accommodation":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (isLoading) {
    return <DashboardLayout>Loading...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Calendar | Travel Itinerary Planner</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Travel Calendar</h1>
            <p className="text-muted-foreground">View and manage your travel schedule</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedItinerary} onValueChange={setSelectedItinerary}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by itinerary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Itineraries</SelectItem>
                {itineraries.map((itinerary) => (
                  <SelectItem key={itinerary.id} value={String(itinerary.id)}>
                    {itinerary.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1 border rounded-md">
              <Button
                variant={view === "month" ? "default" : "ghost"}
                size="sm"
                className="rounded-none rounded-l-md"
                onClick={() => setView("month")}
              >
                Month
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none rounded-r-md"
                onClick={() => setView("list")}
              >
                List
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {view === "month" ? (
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium py-2">
                    {day}
                  </div>
                ))}

                {/* Fill in empty days from previous month */}
                {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, index) => (
                  <div key={`empty-start-${index}`} className="h-24 border rounded-md bg-muted/20 p-1"></div>
                ))}

                {/* Days of current month */}
                {daysInMonth.map((day) => {
                  const dayEvents = getEventsForDay(day)
                  const isToday = isSameDay(day, new Date())

                  return (
                    <div
                      key={day.toString()}
                      className={`h-24 border rounded-md p-1 overflow-hidden ${
                        isToday ? "bg-primary/10 border-primary" : ""
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>
                          {format(day, "d")}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-xs bg-primary/20 text-primary px-1 rounded-full">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
                        {dayEvents.slice(0, 3).map((event) => (
                          <Link
                            key={event.id}
                            href={`/dashboard/itineraries/${event.itineraryId}`}
                            className={`block text-xs truncate p-1 rounded ${getEventTypeColor(event.type)}`}
                          >
                            {event.title}
                          </Link>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-center text-muted-foreground">+{dayEvents.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Fill in empty days from next month */}
                {Array.from({
                  length: 6 - endOfMonth(currentDate).getDay(),
                }).map((_, index) => (
                  <div key={`empty-end-${index}`} className="h-24 border rounded-md bg-muted/20 p-1"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No events found for this month</p>
                  </div>
                ) : (
                  events
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((event) => (
                      <Link key={event.id} href={`/dashboard/itineraries/${event.itineraryId}`} className="block">
                        <Card className="hover:border-primary transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                                </div>
                                {event.location && (
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <MapPin className="h-3.5 w-3.5 mr-1" />
                                    {event.location}
                                  </div>
                                )}
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs ${getEventTypeColor(event.type)}`}>
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              From itinerary: {event.itineraryTitle}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
