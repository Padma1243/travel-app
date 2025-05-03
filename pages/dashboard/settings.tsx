"use client"

import { useState } from "react"
import Head from "next/head"
// Update the import at the top
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSession } from "@/components/session-provider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BellRing, Globe, Lock, Moon, Sun } from "lucide-react"

// Define the schemas with required fields
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  tripReminders: z.boolean(),
  marketingEmails: z.boolean(),
}).required()

const privacySchema = z.object({
  profileVisibility: z.enum(["public", "private", "friends"]),
  shareLocation: z.boolean(),
  allowTagging: z.boolean(),
}).required()

const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  compactMode: z.boolean(),
  highContrast: z.boolean(),
}).required()

// Define types from schemas
type NotificationFormValues = z.infer<typeof notificationSchema>
type PrivacyFormValues = z.infer<typeof privacySchema>
type AppearanceFormValues = z.infer<typeof appearanceSchema>

export default function Settings() {
  const { session } = useSession({ required: true })
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("notifications")

  // Notifications form
  const {
    register: registerNotifications,
    handleSubmit: handleSubmitNotifications,
    formState: { errors: notificationErrors },
    setValue: setNotificationValue,
    watch: watchNotifications,
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: false,
      pushNotifications: false,
      tripReminders: false,
      marketingEmails: false,
    },
  })

  // Privacy form
  const {
    handleSubmit: handleSubmitPrivacy,
    formState: { errors: privacyErrors },
    setValue: setPrivacyValue,
    watch: watchPrivacy,
  } = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      profileVisibility: "private",
      shareLocation: false,
      allowTagging: false,
    },
  })

  // Appearance form
  const {
    handleSubmit: handleSubmitAppearance,
    formState: { errors: appearanceErrors },
    setValue: setAppearanceValue,
    watch: watchAppearance,
  } = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: "system",
      compactMode: false,
      highContrast: false,
    },
  })

  // Watch form values
  const notificationValues = watchNotifications()
  const privacyValues = watchPrivacy()
  const appearanceValues = watchAppearance()

  // Submit handlers
  // Update submit handlers with proper typing
  const onSubmitNotifications: SubmitHandler<NotificationFormValues> = async (data: NotificationFormValues) => {
    try {
      // In a real app, you would save these settings to the database
      console.log("Notification settings:", data)

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      })
    }
  }

  const onSubmitPrivacy: SubmitHandler<PrivacyFormValues> = async (data: PrivacyFormValues) => {
    try {
      // In a real app, you would save these settings to the database
      console.log("Privacy settings:", data)

      toast({
        title: "Settings saved",
        description: "Your privacy preferences have been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save privacy settings",
        variant: "destructive",
      })
    }
  }

  const onSubmitAppearance: SubmitHandler<AppearanceFormValues> = async (data: AppearanceFormValues) => {
    try {
      // In a real app, you would save these settings to the database
      console.log("Appearance settings:", data)

      toast({
        title: "Settings saved",
        description: "Your appearance preferences have been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save appearance settings",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Settings | Travel Itinerary Planner</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <form onSubmit={handleSubmitNotifications(onSubmitNotifications)}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BellRing className="h-5 w-5 mr-2" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>Manage how you receive notifications and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationValues.emailNotifications}
                      onCheckedChange={(checked) => setNotificationValue("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationValues.pushNotifications}
                      onCheckedChange={(checked) => setNotificationValue("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="tripReminders">Trip Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminders about upcoming trips</p>
                    </div>
                    <Switch
                      id="tripReminders"
                      checked={notificationValues.tripReminders}
                      onCheckedChange={(checked) => setNotificationValue("tripReminders", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingEmails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive promotional emails and offers</p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      checked={notificationValues.marketingEmails}
                      onCheckedChange={(checked) => setNotificationValue("marketingEmails", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Notification Settings</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <form onSubmit={handleSubmitPrivacy(onSubmitPrivacy)}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>Manage your privacy and security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <Select
                      value={privacyValues.profileVisibility}
                      onValueChange={(value: "public" | "private" | "friends") =>
                        setPrivacyValue("profileVisibility", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                        <SelectItem value="friends">Friends - Only collaborators can see your profile</SelectItem>
                        <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="shareLocation">Share Location</Label>
                      <p className="text-sm text-muted-foreground">Allow sharing your location with collaborators</p>
                    </div>
                    <Switch
                      id="shareLocation"
                      checked={privacyValues.shareLocation}
                      onCheckedChange={(checked) => setPrivacyValue("shareLocation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowTagging">Allow Tagging</Label>
                      <p className="text-sm text-muted-foreground">Allow others to tag you in itineraries</p>
                    </div>
                    <Switch
                      id="allowTagging"
                      checked={privacyValues.allowTagging}
                      onCheckedChange={(checked) => setPrivacyValue("allowTagging", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Privacy Settings</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <form onSubmit={handleSubmitAppearance(onSubmitAppearance)}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sun className="h-5 w-5 mr-2" />
                    Appearance Settings
                  </CardTitle>
                  <CardDescription>Customize how the application looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={appearanceValues.theme}
                      onValueChange={(value: "light" | "dark" | "system") => setAppearanceValue("theme", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center">
                            <Sun className="h-4 w-4 mr-2" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center">
                            <Moon className="h-4 w-4 mr-2" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compactMode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact layout</p>
                    </div>
                    <Switch
                      id="compactMode"
                      checked={appearanceValues.compactMode}
                      onCheckedChange={(checked) => setAppearanceValue("compactMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="highContrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                    <Switch
                      id="highContrast"
                      checked={appearanceValues.highContrast}
                      onCheckedChange={(checked) => setAppearanceValue("highContrast", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Appearance Settings</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                These actions are permanent and cannot be undone. Please proceed with caution.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600">
                Delete All Itineraries
              </Button>
              <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}            