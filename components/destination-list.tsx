"use client"

import { useState } from "react"
import { Edit, MapPin, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { DeleteDialog } from "@/components/delete-dialog"
import { format } from "date-fns"

interface DestinationListProps {
  destinations: any[]
  itineraryId: string
  isEditable: boolean | null
  onUpdate: () => void
}

export function DestinationList({ destinations, itineraryId, isEditable, onUpdate }: DestinationListProps) {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentDestination, setCurrentDestination] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddClick = () => {
    setFormData({
      name: "",
      address: "",
      latitude: "",
      longitude: "",
    })
    setIsAddDialogOpen(true)
  }

  const handleEditClick = (destination: any) => {
    setCurrentDestination(destination)
    setFormData({
      name: destination.name,
      address: destination.address || "",
      latitude: destination.latitude ? String(destination.latitude) : "",
      longitude: destination.longitude ? String(destination.longitude) : "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (destination: any) => {
    setCurrentDestination(destination)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (isEdit: boolean) => {
    setIsSubmitting(true)

    try {
      const endpoint = isEdit
        ? `/api/itineraries/${itineraryId}/destinations/${currentDestination.id}`
        : `/api/itineraries/${itineraryId}/destinations`

      const method = isEdit ? "PUT" : "POST"

      const data = {
        ...formData,
        latitude: formData.latitude ? Number.parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? Number.parseFloat(formData.longitude) : null,
      }

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" ,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save destination")
      }

      toast({
        title: isEdit ? "Destination updated" : "Destination added",
        description: isEdit
          ? `${formData.name} has been updated successfully`
          : `${formData.name} has been added to your itinerary`,
      })

      onUpdate()
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save destination",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/destinations/${currentDestination.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete destination")
      }

      toast({
        title: "Destination deleted",
        description: `${currentDestination.name} has been removed from your itinerary`,
      })

      onUpdate()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete destination",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Destinations</CardTitle>
            <CardDescription>Places you'll visit on your trip</CardDescription>
          </div>
          {isEditable && (
            <Button size="sm" onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" /> Add Destination
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {destinations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No destinations added yet</p>
              {isEditable && (
                <Button variant="outline" className="mt-4" onClick={handleAddClick}>
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Destination
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destinations.map((destination) => (
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
                    {isEditable && (
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(destination)}>
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteClick(destination)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Destination Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Destination</DialogTitle>
            <DialogDescription>Add a new destination to your itinerary</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Destination Name</Label>
              <Input
                id="name"
                placeholder="Paris, France"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Textarea
                id="address"
                placeholder="Full address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude (Optional)</Label>
                <Input
                  id="latitude"
                  placeholder="48.8566"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude (Optional)</Label>
                <Input
                  id="longitude"
                  placeholder="2.3522"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit(false)} disabled={!formData.name || isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Destination"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Destination Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
            <DialogDescription>Update destination details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Destination Name</Label>
              <Input
                id="edit-name"
                placeholder="Paris, France"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address (Optional)</Label>
              <Textarea
                id="edit-address"
                placeholder="Full address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-latitude">Latitude (Optional)</Label>
                <Input
                  id="edit-latitude"
                  placeholder="48.8566"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-longitude">Longitude (Optional)</Label>
                <Input
                  id="edit-longitude"
                  placeholder="2.3522"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit(true)} disabled={!formData.name || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Destination Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        title="Delete Destination"
        description={`Are you sure you want to delete ${currentDestination?.name || "this destination"}? This will also remove any activities associated with this destination.`}
      />
    </>
  )
}
