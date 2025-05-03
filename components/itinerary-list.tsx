import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Users } from "lucide-react"

interface Itinerary {
  id: string
  title: string
  description?: string | null
  startDate: string
  endDate: string
  isPublic: boolean
  destinations: { city: string; country: string }[] | null | undefined
  collaborators: { user: { name: string } }[] | null | undefined
}

interface ItineraryListProps {
  itineraries: Itinerary[]  // This is the expected prop name
  onUpdate: () => void
}

export function ItineraryList({ itineraries, onUpdate }: ItineraryListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {itineraries.map((itinerary) => (
        <Link
          key={itinerary.id}
          href={`/dashboard/itineraries/${itinerary.id}`}
          className="transition-transform hover:scale-[1.02]"
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-2">{itinerary.title}</CardTitle>
                {itinerary.isPublic && (
                  <Badge variant="secondary">Public</Badge>
                )}
              </div>
              <CardDescription className="line-clamp-2">
                {itinerary.description ?? "No description"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>
                    {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
                  </span>
                </div>

                {itinerary.destinations && itinerary.destinations.length > 0 && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="line-clamp-1">
                      {itinerary.destinations.map((d) => `${d.city}, ${d.country}`).join(" → ")}
                    </span>
                  </div>
                )}

                {itinerary.collaborators && itinerary.collaborators.length > 0 && (
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>
                      {itinerary.collaborators.length} collaborator{itinerary.collaborators.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
