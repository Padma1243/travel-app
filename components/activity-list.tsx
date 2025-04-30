"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Edit, MapPin, Plus, Trash2 } from "lucide-react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ActivityListProps {
    activities: any[]
    destinations: any[]
    itineraryId: string
    isEditable: boolean | null
    onUpdate: () => void
}

export function ActivityList({ activities, destinations, itineraryId, isEditable, onUpdate }: ActivityListProps) {
    const { toast } = useToast()
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentActivity, setCurrentActivity] = useState<any>(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        destinationId: "",
        startDate: null as Date | null,
        startTime: "",
        endDate: null as Date | null,
        endTime: "",
        cost: "",
        currency: "USD",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAddClick = () => {
        setFormData({
            title: "",
            description: "",
            destinationId: destinations.length > 0 ? String(destinations[0].id) : "",
            startDate: null,
            startTime: "",
            endDate: null,
            endTime: "",
            cost: "",
            currency: "USD",
        })
        setIsAddDialogOpen(true)
    }

    const handleEditClick = (activity: any) => {
        setCurrentActivity(activity)

        // Parse dates from ISO strings
        const startDateTime = activity.startTime ? new Date(activity.startTime) : null
        const endDateTime = activity.endTime ? new Date(activity.endTime) : null

        setFormData({
            title: activity.title,
            description: activity.description || "",
            destinationId: activity.destinationId ? String(activity.destinationId) : "",
            startDate: startDateTime,
            startTime: startDateTime ? format(startDateTime, "HH:mm") : "",
            endDate: endDateTime,
            endTime: endDateTime ? format(endDateTime, "HH:mm") : "",
            cost: activity.cost ? String(activity.cost) : "",
            currency: activity.currency || "USD",
        })
        setIsEditDialogOpen(true)
    }

    const handleDeleteClick = (activity: any) => {
        setCurrentActivity(activity)
        setIsDeleteDialogOpen(true)
    }

    const handleSubmit = async (isEdit: boolean) => {
        setIsSubmitting(true)

        try {
            // Combine date and time for start and end
            let startDateTime = null
            let endDateTime = null

            if (formData.startDate) {
                const startDate = new Date(formData.startDate)
                if (formData.startTime) {
                    const [hours, minutes] = formData.startTime.split(":").map(Number)
                    startDate.setHours(hours, minutes)
                }
                startDateTime = startDate.toISOString()
            }

            if (formData.endDate) {
                const endDate = new Date(formData.endDate)
                if (formData.endTime) {
                    const [hours, minutes] = formData.endTime.split(":").map(Number)
                    endDate.setHours(hours, minutes)
                }
                endDateTime = endDate.toISOString()
            }

            const data = {
                title: formData.title,
                description: formData.description || null,
                destinationId: formData.destinationId ? String(formData.destinationId) : null,
                startTime: startDateTime,
                endTime: endDateTime,
                cost: formData.cost ? Number(formData.cost) : null,
                currency: formData.currency,
            }

            const endpoint = isEdit
                ? `/api/itineraries/${itineraryId}/activities/${currentActivity.id}`
                : `/api/itineraries/${itineraryId}/activities`

            const method = isEdit ? "PUT" : "POST"

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json",
                           'Authorization': `Bearer ${localStorage.getItem('token')}`
                 },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to save activity")
            }

            toast({
                title: isEdit ? "Activity updated" : "Activity added",
                description: isEdit
                    ? `${formData.title} has been updated successfully`
                    : `${formData.title} has been added to your itinerary`,
            })

            onUpdate()
            setIsAddDialogOpen(false)
            setIsEditDialogOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save activity",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/itineraries/${itineraryId}/activities/${currentActivity.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete activity")
            }

            toast({
                title: "Activity deleted",
                description: `${currentActivity.title} has been removed from your itinerary`,
            })

            onUpdate()
            setIsDeleteDialogOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete activity",
                variant: "destructive",
            })
        }
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Activities</CardTitle>
                        <CardDescription>Things to do during your trip</CardDescription>
                    </div>
                    {isEditable && (
                        <Button size="sm" onClick={handleAddClick}>
                            <Plus className="h-4 w-4 mr-2" /> Add Activity
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {activities.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No activities added yet</p>
                            {isEditable && (
                                <Button variant="outline" className="mt-4" onClick={handleAddClick}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Your First Activity
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <Card key={activity.id}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">{activity.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {activity.startTime && (
                                            <div className="flex items-start mb-2">
                                                <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">
                                                    {format(new Date(activity.startTime), "MMM d, yyyy h:mm a")}
                                                    {activity.endTime && ` - ${format(new Date(activity.endTime), "h:mm a")}`}
                                                </span>
                                            </div>
                                        )}
                                        {activity.destination && (
                                            <div className="flex items-start mb-2">
                                                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">{activity.destination.name}</span>
                                            </div>
                                        )}
                                        {activity.description && <p className="text-sm mt-2">{activity.description}</p>}
                                        {activity.cost && (
                                            <div className="mt-2 text-sm font-medium">
                                                Cost: {activity.currency} {Number(activity.cost).toFixed(2)}
                                            </div>
                                        )}
                                        {isEditable && (
                                            <div className="flex gap-2 mt-4">
                                                <Button variant="outline" size="sm" onClick={() => handleEditClick(activity)}>
                                                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => handleDeleteClick(activity)}
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

            {/* Add Activity Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Activity</DialogTitle>
                        <DialogDescription>Add a new activity to your itinerary</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Activity Title</Label>
                            <Input
                                id="title"
                                placeholder="Visit Eiffel Tower"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="destination">Destination</Label>
                            <Select
                                value={formData.destinationId}
                                onValueChange={(value) => setFormData({ ...formData, destinationId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {destinations.map((destination) => (
                                        <SelectItem key={destination.id} value={String(destination.id)}>
                                            {destination.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent
                                            mode="single"
                                            selected={formData.startDate || undefined} // Ensure it's null if undefined
                                            onSelect={(date) => setFormData({ ...formData, startDate: date ?? null })}
                                            initialFocus
                                        />
                                    </PopoverContent>

                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent
                                            mode="single"
                                            selected={formData.endDate || undefined}
                                            onSelect={(date) => setFormData({ ...formData, endDate: date ?? null})}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cost">Cost (Optional)</Label>
                                <Input
                                    id="cost"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select
                                    value={formData.currency}
                                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                        <SelectItem value="JPY">JPY</SelectItem>
                                        <SelectItem value="CAD">CAD</SelectItem>
                                        <SelectItem value="AUD">AUD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => handleSubmit(false)} disabled={!formData.title || isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Activity"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Activity Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Activity</DialogTitle>
                        <DialogDescription>Update activity details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Activity Title</Label>
                            <Input
                                id="edit-title"
                                placeholder="Visit Eiffel Tower"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-destination">Destination</Label>
                            <Select
                                value={formData.destinationId}
                                onValueChange={(value) => setFormData({ ...formData, destinationId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {destinations.map((destination) => (
                                        <SelectItem key={destination.id} value={String(destination.id)}>
                                            {destination.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent
                                            mode="single"
                                            selected={formData.startDate || undefined}
                                            onSelect={(date) => setFormData({ ...formData, startDate: date ?? null })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-startTime">Start Time</Label>
                                <Input
                                    id="edit-startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent
                                            mode="single"
                                            selected={formData.endDate || undefined}
                                            onSelect={(date) => setFormData({ ...formData, endDate: date ?? null })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-endTime">End Time</Label>
                                <Input
                                    id="edit-endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-cost">Cost (Optional)</Label>
                                <Input
                                    id="edit-cost"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-currency">Currency</Label>
                                <Select
                                    value={formData.currency}
                                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                        <SelectItem value="JPY">JPY</SelectItem>
                                        <SelectItem value="CAD">CAD</SelectItem>
                                        <SelectItem value="AUD">AUD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => handleSubmit(true)} disabled={!formData.title || isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Activity Dialog */}
            <DeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onDelete={handleDelete}
                title="Delete Activity"
                description={`Are you sure you want to delete "${currentActivity?.title || "this activity"}"? This action cannot be undone.`}
            />
        </>
    )
}
