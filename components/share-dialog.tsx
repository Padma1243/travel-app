"use client"

import { useState } from "react"
import { Check, Copy, Globe, Mail, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itineraryId: string
  isPublic: boolean
  onUpdate: () => void
}

export function ShareDialog({ open, onOpenChange, itineraryId, isPublic, onUpdate }: ShareDialogProps) {
  const { toast } = useToast()
  const [isPublicSwitchOn, setIsPublicSwitchOn] = useState(isPublic)
  const [email, setEmail] = useState("")
  const [permission, setPermission] = useState("view")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/share/${itineraryId}` : ""

  const handleTogglePublic = async () => {
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !isPublicSwitchOn }),
      })

      if (!response.ok) {
        throw new Error("Failed to update itinerary")
      }

      setIsPublicSwitchOn(!isPublicSwitchOn)
      onUpdate()

      toast({
        title: !isPublicSwitchOn ? "Itinerary is now public" : "Itinerary is now private",
        description: !isPublicSwitchOn
          ? "Anyone with the link can view this itinerary"
          : "Only you and collaborators can view this itinerary",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update sharing settings",
        variant: "destructive",
      })
    }
  }

  const handleInvite = async () => {
    if (!email) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, permission }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to invite collaborator")
      }

      toast({
        title: "Invitation sent",
        description: `${email} has been invited to collaborate on this itinerary`,
      })

      setEmail("")
      onUpdate()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to invite collaborator",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Itinerary</DialogTitle>
          <DialogDescription>Share your travel plans with others</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="link" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="invite">Invite Collaborator</TabsTrigger>
          </TabsList>
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <h4 className="text-sm font-medium">Public access</h4>
              <div className="ml-auto">
                <Switch checked={isPublicSwitchOn} onCheckedChange={handleTogglePublic} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {isPublicSwitchOn
                ? "Anyone with the link can view this itinerary"
                : "Only you and collaborators can view this itinerary"}
            </p>

            <div className="flex items-center space-x-2 mt-4">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input id="link" readOnly value={shareUrl} className="h-9" disabled={!isPublicSwitchOn} />
              </div>
              <Button size="sm" className="px-3" onClick={copyToClipboard} disabled={!isPublicSwitchOn}>
                <span className="sr-only">Copy</span>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={!isPublicSwitchOn}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Check out my travel itinerary",
                      url: shareUrl,
                    })
                  } else {
                    copyToClipboard()
                  }
                }}
              >
                <Share className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={!isPublicSwitchOn}
                onClick={() => {
                  window.open(`mailto:?subject=Check out my travel itinerary&body=${shareUrl}`, "_blank")
                }}
              >
                <Mail className="h-4 w-4 mr-2" /> Email
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="invite" className="space-y-4 mt-4">
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
              <select
                id="permission"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-muted-foreground">
                {permission === "view"
                  ? "Can view the itinerary but cannot make changes"
                  : permission === "edit"
                    ? "Can make changes to the itinerary"
                    : "Can edit and manage collaborators"}
              </p>
            </div>
            <Button className="w-full" onClick={handleInvite} disabled={!email || isSubmitting}>
              {isSubmitting ? "Inviting..." : "Invite Collaborator"}
            </Button>
          </TabsContent>
        </Tabs>
        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
