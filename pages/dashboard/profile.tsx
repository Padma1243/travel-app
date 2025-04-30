"use client"

import { useState, useRef } from "react"
import { useSession } from "@/components/session-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function Profile() {
  const { session, login } = useSession({ required: true })
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    currentPassword: "",
    newPassword: "",
  })

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      setIsLoading(true)
      const uploadRes = await fetch("/api/user/upload-avatar", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      })
      
      if (!uploadRes.ok) {
        throw new Error("Failed to upload image")
      }

      const { url } = await uploadRes.json()

      const profileRes = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ avatarUrl: url }),
      })

      if (!profileRes.ok) {
        throw new Error("Failed to update profile")
      }

      const { user, token } = await profileRes.json()
      login(user, token)
      toast.success("Profile picture updated successfully")
    } catch (error) {
      toast.error("Failed to update profile picture")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}` // Add Authorization header
        },
        body: JSON.stringify(formData),
      })
  
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }
  
      const { user, token } = await res.json()
      login(user, token)
  
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }))
      toast.success("Profile updated successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <div 
                  className="relative cursor-pointer group"
                  onClick={handleAvatarClick}
                >
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={session?.user?.avatarUrl || ""} />
                    <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-sm">Change</span>
                  </div>
                </div>
                <div className="flex-1">
                  
                  <input
                    ref={fileInputRef}
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={session?.user?.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Change Password</h3>
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
