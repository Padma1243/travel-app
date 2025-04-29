"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { format } from "date-fns"
import { Calendar, MapPin, User, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Layout } from "@/components/layout"
import ItineraryMap  from "@/components/itinerary-map"
import { ItineraryTimeline } from "@/components/itinerary-timeline"
import { BudgetSummary } from "@/components/budget-summary"

export default function SharedItinerary() {
  const router = useRouter()
  const { id } = router.query
  const [itinerary, setItinerary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchItinerary()
    }
  }, [id])

  const fetchItinerary = async () => {
    try {
      const response = await fetch(`/api/share/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Itinerary not found or not public")
        }
        throw new Error("Failed to load itinerary")
      }
      
      const data = await response.json()
      setItinerary(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-6 space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </Layout>
    )
  }

  if (error || !itinerary) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Itinerary not found</h2>
            <p className="text-muted-foreground mt-2">
              {error || "The itinerary you're looking for doesn't exist or is not public."}
            </p>
            <Button className="mt-6" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head>
        <title>{itinerary.title} | Travel Itinerary Planner</title>
        <meta name="description" content={itinerary.description || `Travel itinerary for ${itinerary.title}`} />
      </Head>

      <div className="container py-6">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{itinerary.title}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(itinerary.startDate), "MMM d")} - {format(new Date(itinerary.endDate), "MMM d, yyyy")}
              {itinerary.destinations.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <MapPin className="h-4 w-4 mr-1" />
                  {itinerary.destinations.length} {itinerary.destinations.length === 1 ? "destination" : "destinations"}
                </>
              )}
            </div>
            <div className="flex items-center text-muted-foreground mt-1">
              <User className="h-4 w-4 mr-1" />
              Created by {itinerary.owner.name}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/register">Create Your Own Itinerary</Link>
            </Button>
          </div>
        </div>

        {itinerary.description && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p>{itinerary.description}</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Map View</CardTitle>
                  <CardDescription>Geographic overview of destinations</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] p-0">
                  <ItineraryMap destinations={itinerary.destinations} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                  <CardDescription>Trip at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ItineraryTimeline
                    startDate={new Date(itinerary.startDate)}
                    endDate={new Date(itinerary.endDate)}
                    activities={itinerary.activities}
                    transportation={itinerary.transportation}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Summary</CardTitle>
                  <CardDescription>Estimated costs for this trip</CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetSummary
                    budgetItems={itinerary.budgetItems}
                    activities={itinerary.activities}
                    accommodations={itinerary.accommodations}
                    transportation={itinerary.transportation}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Trip Schedule</CardTitle>
                <CardDescription>Daily breakdown of the itinerary</CardDescription>
              </CardHeader>
              <CardContent>
                <ItineraryTimeline
                  startDate={new Date(itinerary.startDate)}
                  endDate={new Date(itinerary.endDate)}
                  activities={itinerary.activities}
                  transportation={itinerary.transportation}
                  accommodations={itinerary.accommodations}
                  detailed
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="destinations">
            <Card>
              <CardHeader>
                <CardTitle>Destinations</CardTitle>
                <CardDescription>Places to visit on this trip</CardDescription>
              </CardHeader>
              <CardContent>
                {itinerary.destinations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No destinations added to this itinerary</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {itinerary.destinations.map((destination: any) => (
                      <Card key={destination.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{destination.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {destination.address && (
                            <div className="flex items-start mb-2">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{destination.address}</span>
                            </div>
                          )}
                          {destination.startDate && (
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(destination.startDate), "MMM d")}
                              {destination.endDate && ` - ${format(new Date(destination.endDate), "MMM d, yyyy")}`}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Create your own travel itineraries</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Sign up for free and start planning your next adventure with our easy-to-use travel itinerary planner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">Sign Up Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
