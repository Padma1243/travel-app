"use client"

import { useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
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

// Schema definition
const itinerarySchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  isPublic: z.boolean(),
}).refine((data) => !data.endDate || !data.startDate || data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
})

type ItineraryFormValues = z.infer<typeof itinerarySchema>

export default function NewItinerary() {
  const { session } = useSession({ required: true })
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
      description: "",
      isPublic: false,
      startDate: undefined as unknown as Date,
      endDate: undefined as unknown as Date,
    },
  })

  const startDate = watch("startDate")
  const endDate = watch("endDate")

  const onSubmit: SubmitHandler<ItineraryFormValues> = async (data) => {
    setIsLoading(true)
    setError(null)

    const token = localStorage.getItem("auth_token")
    if(!token){
      alert(" Token Missing");
    }
    try {
      const response = await fetch("/api/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to create itinerary")
      }

      toast({
        title: "Success",
        description: "Itinerary created successfully",
      })

      router.push(`/dashboard/itineraries/${result.id}`)
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

  return (
    <DashboardLayout>
      <Head>
        <title>Create New Itinerary | Travel Itinerary Planner</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Itinerary</h1>

        <Card>
          <CardHeader>
            <CardTitle>Itinerary Details</CardTitle>
            <CardDescription>Fill in the basic details for your new travel itinerary</CardDescription>
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
                <Input id="title" placeholder="Summer Vacation 2023" {...register("title")} />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="A brief description of your trip"
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
                        disabled={(date) => (startDate ? date < startDate : false)}
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
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Itinerary"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
