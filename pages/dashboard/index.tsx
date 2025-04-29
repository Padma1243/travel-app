"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { format } from "date-fns"
import { Calendar, MapPin, Plus, Users } from "lucide-react"
import { useSession } from "@/components/session-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EmptyState } from "@/components/empty-state"
import { useToast } from "@/components/ui/use-toast"

interface Itinerary {
  id: number
  title: string
  description: string | null
  startDate: string
  endDate: string
  isPublic: boolean
  destinations: { name: string }[]
  collaborators: { user: { name: string } }[]
}

export default function Dashboard() {
  const { session, loading } = useSession({ required: true })
  const router = useRouter()
  const { toast } = useToast()
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && session) {
      fetchItineraries()
    }
  }, [session, loading])

  const fetchItineraries = async () => {
    try {
      const response = await fetch("/api/itineraries")
      if (!response.ok) {
        throw new Error("Failed to fetch itineraries")
      }
      const data = await response.json()
      setItineraries(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your itineraries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return <DashboardLayout>Loading...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard | Travel Itinerary Planner</title>
      </Head>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Itineraries</h1>
        <Button onClick={() => router.push("/dashboard/itineraries/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Itinerary
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : itineraries.length === 0 ? (
        <EmptyState
          title="No itineraries yet"
          description="Create your first travel itinerary to get started"
          action={
            <Button onClick={() => router.push("/dashboard/itineraries/new")}>
              <Plus className="mr-2 h-4 w-4" /> Create Itinerary
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <Link href={`/dashboard/itineraries/${itinerary.id}`} key={itinerary.id} className="block group">
              <Card className="h-full overflow-hidden transition-all hover:border-primary">
                <CardHeader>
                  <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                    {itinerary.title}
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {format(new Date(itinerary.startDate), "MMM d")} -{" "}
                    {format(new Date(itinerary.endDate), "MMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {itinerary.destinations.length > 0 ? (
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {itinerary.destinations.map((d) => d.name).join(", ")}
                    </div>
                  ) : null}
                  {itinerary.collaborators.length > 0 ? (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      Shared with {itinerary.collaborators.length}{" "}
                      {itinerary.collaborators.length === 1 ? "person" : "people"}
                    </div>
                  ) : null}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
