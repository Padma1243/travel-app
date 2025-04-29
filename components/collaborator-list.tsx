"use client"

import { useState } from "react"
import { Mail, Plus, Shield, Trash2, UserPlus } from 'lucide-react'
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
import { useToast } from "@/components/ui/use-toast"
import { DeleteDialog } from "@/components/delete-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "@/components/session-provider"

interface CollaboratorListProps {
  collaborators: any[]
  itineraryId: string
  onUpdate: () => void
}

export function CollaboratorList({ collaborators, itineraryId, onUpdate }: CollaboratorListProps) {
  const { session } = useSession()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCollaborator, setCurrentCollaborator] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [permission, setPermission] = useState("view")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddClick = () => {
    setEmail("")
    setPermission("view")
    setIsAddDialogOpen(true)
  }

  const handleDeleteClick = (collaborator: any) => {
    setCurrentCollaborator(collaborator)
    setIsDeleteDialogOpen(true)
  }

  const handlePermissionChange = async (collaboratorId: number, newPermission: string) => {
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/collaborators/${collaboratorId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token}`
        },
        body: JSON.stringify({ permission: newPermission }),
      })

      if (!response.ok) {
        throw new Error("Failed to update permission")
      }

      toast({
        title: "Permission updated",
        description: "Collaborator permission has been updated successfully",
      })

      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permission",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    if (!email) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/collaborators`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token}`
        },
        body: JSON.stringify({ email, permission }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to add collaborator")
      }

      toast({
        title: "Collaborator added",
        description: `${email} has been added to your itinerary`,
      })

      setEmail("")
      setIsAddDialogOpen(false)
      onUpdate()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add collaborator",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/collaborators/${currentCollaborator.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session?.token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to remove collaborator")
      }

      toast({
        title: "Collaborator removed",
        description: `${currentCollaborator.user.name} has been removed from your itinerary`,
      })

      onUpdate()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove collaborator",
        variant: "destructive",
      })
    }
  }

  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case "admin":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </span>
        )
      case "edit":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Edit
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            View
          </span>
        )
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Collaborators</CardTitle>
            <CardDescription>People with access to this itinerary</CardDescription>
          </div>
          <Button size="sm" onClick={handleAddClick}>
            <UserPlus className="h-4 w-4 mr-2" /> Add Collaborator
          </Button>
        </CardHeader>
        <CardContent>
          {collaborators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No collaborators yet</p>
              <Button variant="outline" className="mt-4" onClick={handleAddClick}>
                <Plus className="h-4 w-4 mr-2" /> Add Your First Collaborator
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={collaborator.user.avatarUrl || ""} alt={collaborator.user.name} />
                      <AvatarFallback>{collaborator.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{collaborator.user.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {collaborator.user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>{getPermissionBadge(collaborator.permission)}</div>
                    <Select
                      value={collaborator.permission}
                      onValueChange={(value) => handlePermissionChange(collaborator.id, value)}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View only</SelectItem>
                        <SelectItem value="edit">Can edit</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                      onClick={() => handleDeleteClick(collaborator)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Collaborator Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Collaborator</DialogTitle>
            <DialogDescription>Invite someone to collaborate on this itinerary</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permission">Permission</Label>
              <Select value={permission} onValueChange={setPermission}>
                <SelectTrigger>
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View only</SelectItem>
                  <SelectItem value="edit">Can edit</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {permission === "view"
                  ? "Can view the itinerary but cannot make changes"
                  : permission === "edit"
                  ? "Can make changes to the itinerary"
                  : "Can edit and manage collaborators"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!email || isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Collaborator"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Collaborator Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        title="Remove Collaborator"
        description={`Are you sure you want to remove ${
          currentCollaborator?.user?.name || "this collaborator"
        } from your itinerary?`}
      />
    </>
  )
}
