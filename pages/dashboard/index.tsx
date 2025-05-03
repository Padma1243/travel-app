"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/components/session-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { PlusIcon } from "lucide-react"
import { ItineraryList } from "@/components/itinerary-list"
import { Itinerary } from "@/types/itinerary"

export default function Dashboard() {
  const { session } = useSession({ required: true })
  const { toast } = useToast()
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchUserItineraries()
    }
  }, [session])

  const fetchUserItineraries = async () => {
    try {
      const response = await fetch("/api/itineraries", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        }
      })
      if (!response.ok) throw new Error("Failed to fetch itineraries")
      const data = await response.json()
      setItineraries(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load itineraries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createNewItinerary = async () => {
    try {
      const response = await fetch("/api/itineraries", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: "New Itinerary",
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          isPublic: false
        })
      })

      if (!response.ok) throw new Error("Failed to create itinerary")
      
      const newItinerary = await response.json()
      setItineraries([newItinerary, ...itineraries])
      
      toast({
        title: "Success",
        description: "New itinerary created",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create itinerary",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Itineraries</h1>
          <Button onClick={createNewItinerary}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create New Itinerary
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : itineraries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No itineraries yet. Create your first one!</p>
          </div>
        ) : (
          <ItineraryList itineraries={itineraries} onUpdate={fetchUserItineraries} />
        )}
      </div>
    </DashboardLayout>
  )
}
