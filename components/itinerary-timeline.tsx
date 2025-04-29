"use client"

import { format, eachDayOfInterval, isSameDay } from "date-fns"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimelineProps {
  startDate: Date
  endDate: Date
  activities?: any[]
  transportation?: any[]
  accommodations?: any[]
  detailed?: boolean
}

export function ItineraryTimeline({
  startDate,
  endDate,
  activities = [],
  transportation = [],
  accommodations = [],
  detailed = false,
}: TimelineProps) {
  // Generate array of days between start and end date
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  // Group events by day
  const eventsByDay = days.map((day) => {
    const dayActivities = activities.filter((activity) =>
      activity.startTime ? isSameDay(new Date(activity.startTime), day) : false,
    )

    const dayTransportation = transportation.filter((transport) =>
      transport.departureTime ? isSameDay(new Date(transport.departureTime), day) : false,
    )

    const dayAccommodations = accommodations.filter(
      (accommodation) => accommodation.checkIn && isSameDay(new Date(accommodation.checkIn), day),
    )

    return {
      date: day,
      activities: dayActivities,
      transportation: dayTransportation,
      accommodations: dayAccommodations,
      hasEvents: dayActivities.length > 0 || dayTransportation.length > 0 || dayAccommodations.length > 0,
    }
  })

  if (!detailed) {
    // Simplified timeline view
    return (
      <div className="space-y-4">
        {eventsByDay.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No events scheduled yet</p>
        ) : (
          <div className="space-y-2">
            {eventsByDay.map((day, index) => (
              <div key={index} className="flex items-start gap-2">
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${day.hasEvents ? "bg-primary" : "bg-muted-foreground/30"}`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{format(day.date, "EEE, MMM d")}</p>
                  {day.hasEvents ? (
                    <p className="text-xs text-muted-foreground">
                      {day.activities.length > 0 && `${day.activities.length} activities`}
                      {day.activities.length > 0 && day.transportation.length > 0 && ", "}
                      {day.transportation.length > 0 && `${day.transportation.length} transportation`}
                      {(day.activities.length > 0 || day.transportation.length > 0) && day.accommodations.length > 0
                        ? ", "
                        : ""}
                      {day.accommodations.length > 0 && `${day.accommodations.length} accommodations`}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">No events</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Detailed timeline view
  return (
    <div className="space-y-8">
      {eventsByDay.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">No events scheduled yet</p>
      ) : (
        eventsByDay.map((day, index) => (
          <div key={index} className="relative">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Calendar className="h-4 w-4" />
              </div>
              <h3 className="ml-4 text-lg font-semibold">{format(day.date, "EEEE, MMMM d, yyyy")}</h3>
            </div>

            {!day.hasEvents ? (
              <div className="mt-2 ml-12 text-muted-foreground">No events scheduled</div>
            ) : (
              <div className="mt-2 ml-12 space-y-4">
                {/* Activities */}
                {day.activities.map((activity: any) => (
                  <Card key={`activity-${activity.id}`} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 py-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Badge variant="outline" className="mr-2">
                          Activity
                        </Badge>
                        {activity.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2 text-sm">
                      {activity.startTime && (
                        <div className="flex items-center text-muted-foreground mb-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {format(new Date(activity.startTime), "h:mm a")}
                          {activity.endTime && ` - ${format(new Date(activity.endTime), "h:mm a")}`}
                        </div>
                      )}
                      {activity.destination && (
                        <div className="flex items-center text-muted-foreground mb-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {activity.destination.name}
                        </div>
                      )}
                      {activity.description && <p className="mt-2">{activity.description}</p>}
                    </CardContent>
                  </Card>
                ))}

                {/* Transportation */}
                {day.transportation.map((transport: any) => (
                  <Card key={`transport-${transport.id}`} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 py-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {transport.type.charAt(0).toUpperCase() + transport.type.slice(1)}
                        </Badge>
                        {transport.fromDestination?.name || "Departure"} to {transport.toDestination?.name || "Arrival"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2 text-sm">
                      {transport.departureTime && (
                        <div className="flex items-center text-muted-foreground mb-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Departure: {format(new Date(transport.departureTime), "h:mm a")}
                        </div>
                      )}
                      {transport.arrivalTime && (
                        <div className="flex items-center text-muted-foreground mb-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Arrival: {format(new Date(transport.arrivalTime), "h:mm a")}
                        </div>
                      )}
                      {transport.bookingReference && (
                        <div className="mt-1">
                          <span className="font-medium">Booking Ref:</span> {transport.bookingReference}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Accommodations */}
                {day.accommodations.map((accommodation: any) => (
                  <Card key={`accommodation-${accommodation.id}`} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 py-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Badge variant="outline" className="mr-2">
                          Accommodation
                        </Badge>
                        {accommodation.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2 text-sm">
                      {accommodation.address && (
                        <div className="flex items-center text-muted-foreground mb-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {accommodation.address}
                        </div>
                      )}
                      <div className="flex items-center text-muted-foreground mb-1">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Check-in: {format(new Date(accommodation.checkIn), "h:mm a")}
                      </div>
                      {accommodation.checkOut && (
                        <div className="flex items-center text-muted-foreground mb-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Check-out:{" "}
                          {isSameDay(new Date(accommodation.checkOut), day.date)
                            ? format(new Date(accommodation.checkOut), "h:mm a")
                            : `${format(new Date(accommodation.checkOut), "MMM d")} at ${format(
                                new Date(accommodation.checkOut),
                                "h:mm a",
                              )}`}
                        </div>
                      )}
                      {accommodation.bookingReference && (
                        <div className="mt-1">
                          <span className="font-medium">Booking Ref:</span> {accommodation.bookingReference}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
