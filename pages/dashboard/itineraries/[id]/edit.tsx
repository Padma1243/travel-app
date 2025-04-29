"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useSession } from "@/components/session-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/components/ui/use-toast"

const itinerarySchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().nullable(),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    isPublic: z.boolean(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })

type ItineraryFormValues = z.infer<typeof itinerarySchema>

export default function EditItinerary() {
  const { session } = useSession({ required: true })
  const router = useRouter()
  const { id } = router.query
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItineraryFormValues>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: {
      title: "",
      description: null,
      isPublic: false,
      startDate: new Date(),
      endDate: new Date(),
    },
  })

  const startDate = watch("startDate")
  const endDate = watch("endDate")

  useEffect(() => {
    if (id && session) {
      fetchItinerary()
    }
  }, [id, session])

  const fetchItinerary = async () => {
    try {
      const response = await fetch(`/api/itineraries/${id}`)
      if (!response.ok) throw new Error("Failed to fetch itinerary")
      
      const data = await response.json()
      
      setValue("title", data.title)
      setValue("description", data.description || "")
      setValue("startDate", new Date(data.startDate))
      setValue("endDate", new Date(data.endDate))
      setValue("isPublic", data.isPublic)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load itinerary",
        variant: "destructive",
      })
      router.push("/dashboard/itineraries")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ItineraryFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update itinerary")
      }

      toast({
        title: "Success",
        description: "Itinerary updated successfully",
      })

      router.push(`/dashboard/itineraries/${id}`)
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Edit Itinerary | Travel Itinerary Planner</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Itinerary</h1>

        <Card>
          <CardHeader>
            <CardTitle>Itinerary Details</CardTitle>
            <CardDescription>Update your travel itinerary details</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setValue("startDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setValue("endDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={watch("isPublic")}
                  onCheckedChange={(checked) => setValue("isPublic", checked)}
                />
                <Label htmlFor="isPublic">Make this itinerary public</Label>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/itineraries/${id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
