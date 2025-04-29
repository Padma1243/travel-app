"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { format } from "date-fns"
import { Calendar, MapPin, Plus, User } from 'lucide-react'
import { useSession } from "@/components/session-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
  owner: {
    id: number
    name: string
  }
  destinations: any[]
}

export default function Itineraries() {
  const { session } = useSession({ required: true })
  const router = useRouter()
  const { toast } = useToast()
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchItineraries()
    }
  }, [session])

  const fetchItineraries = async () => {
    try {
      const response = await fetch("/api/itineraries", {
        headers: {
          'Authorization': `Bearer ${session?.token}`
        }
      })
      
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

  return (
    <DashboardLayout>
      <Head>
        <title>My Itineraries | Travel Itinerary Planner</title>
      </Head>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Itineraries</h1>
          <p className="text-muted-foreground">Manage your travel plans</p>
        </div>
        <Button onClick={() => router.push("/dashboard/itineraries/new")}>
          <Plus className="h-4 w-4 mr-2" /> New Itinerary
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : itineraries.length === 0 ? (
        <EmptyState
          title="No itineraries yet"
          description="Create your first travel itinerary to get started"
          action={
            <Button onClick={() => router.push("/dashboard/itineraries/new")}>
              <Plus className="h-4 w-4 mr-2" /> Create Itinerary
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video w-full bg-muted relative">
                {itinerary.destinations.length > 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <MapPin className="h-12 w-12 text-muted-foreground/20" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Calendar className="h-12 w-12 text-muted-foreground/20" />
                  </div>
                )}
              </div>
              <CardContent className="p-6 flex-1">
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">{itinerary.title}</h2>
                {itinerary.description && (
                  <p className="text-muted-foreground mb-4 line-clamp-2">{itinerary.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {format(new Date(itinerary.startDate), "MMM d")} - {format(new Date(itinerary.endDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                {itinerary.owner.id !== session?.user.id && (
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    <span>Shared by {itinerary.owner.name}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="px-6 py-4 bg-muted/30 border-t">
                <Link
                  href={`/dashboard/itineraries/${itinerary.id}`}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  View Details
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
