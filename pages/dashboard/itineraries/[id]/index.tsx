"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { format } from "date-fns"
import { Calendar, MapPin, DollarSign, Edit, Trash2, Share2 } from 'lucide-react'
import { useSession } from "@/components/session-provider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/dashboard-layout"
import ItineraryMap from "@/components/itinerary-map"
import { ItineraryTimeline } from "@/components/itinerary-timeline"
import { BudgetSummary } from "@/components/budget-summary"
import { DestinationList } from "@/components/destination-list"
import { ActivityList } from "@/components/activity-list"
import { CollaboratorList } from "@/components/collaborator-list"
import { ShareDialog } from "@/components/share-dialog"
import { DeleteDialog } from "@/components/delete-dialog"
import { useToast } from "@/components/ui/use-toast"

interface Itinerary {
  id: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  isPublic: boolean
  ownerId: string
  owner: {
    id: string
    name: string
  }
  destinations: Array<{
    id: string
    name: string
    location: string
    coordinates?: {
      lat: number
      lng: number
    }
  }>
  activities: any[]
  accommodations: any[]
  transportation: any[]
  collaborators: any[]
  budgetItems: any[]
}

export default function ItineraryDetails() {
  const { session } = useSession({ required: true })
  const router = useRouter()
  const { id } = router.query
  const { toast } = useToast()
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (id && session) {
      fetchItinerary()
    }
  }, [id, session])

  const fetchItinerary = async () => {
    const token = localStorage.getItem("auth_token")
    if(!token){
      alert(" Token Missing");
    }
    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 👈 attach the token here
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch itinerary")
      }
      const data = await response.json()
      setItinerary(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load itinerary details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete itinerary")
      }

      toast({
        title: "Success",
        description: "Itinerary deleted successfully",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete itinerary",
        variant: "destructive",
      })
    }
  }

  const isOwner = itinerary && session && itinerary.ownerId ===String( session.user.id)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </DashboardLayout>
    )
  }

  if (!itinerary) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Itinerary not found</h2>
          <p className="text-muted-foreground mt-2">
            The itinerary you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button className="mt-6" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Head>
        <title>{itinerary.title} | Travel Itinerary Planner</title>
      </Head>

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
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsShareDialogOpen(true)}>
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          {isOwner && (
            <>
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/itineraries/${id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </>
          )}
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
        <TabsList className="mb-4 overflow-x-auto flex-nowrap w-full justify-start sm:justify-center">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          {isOwner && <TabsTrigger value="collaborators">Collaborators</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Map View</CardTitle>
                <CardDescription>Geographic overview of your destinations</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] p-0">
                <ItineraryMap destinations={itinerary.destinations} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Your trip at a glance</CardDescription>
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
                <CardDescription>Estimated costs for your trip</CardDescription>
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
              <CardDescription>Daily breakdown of your itinerary</CardDescription>
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
          <DestinationList
            destinations={itinerary.destinations}
            itineraryId={itinerary.id}
            isEditable={isOwner}
            onUpdate={fetchItinerary}
          />
        </TabsContent>

        <TabsContent value="activities">
          <ActivityList
            activities={itinerary.activities}
            destinations={itinerary.destinations}
            itineraryId={itinerary.id}
            isEditable={isOwner}
            onUpdate={fetchItinerary}
          />
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Budget Tracking</CardTitle>
                <CardDescription>Manage your trip expenses</CardDescription>
              </div>
              {isOwner && (
                <Button size="sm" onClick={() => router.push(`/dashboard/itineraries/${id}/budget/new`)}>
                  <DollarSign className="h-4 w-4 mr-2" /> Add Expense
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <BudgetSummary
                budgetItems={itinerary.budgetItems}
                activities={itinerary.activities}
                accommodations={itinerary.accommodations}
                transportation={itinerary.transportation}
                detailed={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {isOwner && (
          <TabsContent value="collaborators">
            <CollaboratorList
              collaborators={itinerary.collaborators}
              itineraryId={itinerary.id}
              onUpdate={fetchItinerary}
            />
          </TabsContent>
        )}
      </Tabs>

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        itineraryId={itinerary.id}
        isPublic={itinerary.isPublic}
        onUpdate={fetchItinerary}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        title="Delete Itinerary"
        description="Are you sure you want to delete this itinerary? This action cannot be undone and all associated data will be permanently removed."
      />
    </DashboardLayout>
  )
}
