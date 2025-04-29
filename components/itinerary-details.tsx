import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Clock } from "lucide-react"

interface ItineraryDetailsProps {
  itinerary: {
    id: string
    title: string
    destination: string
    startDate: string
    endDate: string
    activities: Array<{
      id: string
      title: string
      location: string
      date: string
      time: string
      notes?: string
    }>
  }
}

const ItineraryDetails: React.FC<ItineraryDetailsProps> = ({ itinerary }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{itinerary.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {itinerary.destination}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Activities</h2>
        {itinerary.activities.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No activities planned yet
            </CardContent>
          </Card>
        ) : (
          itinerary.activities.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium">{activity.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {activity.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(activity.date).toLocaleDateString()} at {activity.time}
                  </div>
                  {activity.notes && (
                    <p className="text-sm text-muted-foreground mt-2">{activity.notes}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export { ItineraryDetails }