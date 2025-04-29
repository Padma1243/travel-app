"use client"

import { useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useForm, SubmitHandler } from "react-hook-form" // Add SubmitHandler
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSession } from "@/components/session-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/components/ui/use-toast"

const budgetItemSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional(),
  estimatedCost: z.string().min(1, { message: "Estimated cost is required" }),
  actualCost: z.string().optional(),
  currency: z.string(), // Changed from z.string().default("USD")
})

type BudgetItemFormValues = z.infer<typeof budgetItemSchema>

export default function NewBudgetItem() {
  const { session } = useSession({ required: true })
  const router = useRouter()
  const { id: itineraryId } = router.query
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BudgetItemFormValues>({
    resolver: zodResolver(budgetItemSchema),
    defaultValues: {
      category: "accommodation",
      currency: "USD", // Provide default value here
    },
  })

  const onSubmit: SubmitHandler<BudgetItemFormValues> = async (data) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/budget`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token}`
        },
        body: JSON.stringify({
          ...data,
          estimatedCost: parseFloat(data.estimatedCost),
          actualCost: data.actualCost ? parseFloat(data.actualCost) : null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to create budget item")
      }

      toast({
        title: "Success",
        description: "Budget item added successfully",
      })

      router.push(`/dashboard/itineraries/${itineraryId}?tab=budget`)
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

  // Rest of your component remains unchanged
  return (
    // ...existing JSX
    <DashboardLayout>
      <Head>
        <title>Add Budget Item | Travel Itinerary Planner</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add Budget Item</h1>

        <Card>
          <CardHeader>
            <CardTitle>Budget Item Details</CardTitle>
            <CardDescription>Add a new expense or budget item to your itinerary</CardDescription>
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
                <Input id="title" placeholder="Hotel Booking" {...register("title")} />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  defaultValue="accommodation"
                  onValueChange={(value) => setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="food">Food & Dining</SelectItem>
                    <SelectItem value="activities">Activities</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" placeholder="3 nights at Hilton Hotel" {...register("description")} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("estimatedCost")}
                  />
                  {errors.estimatedCost && <p className="text-sm text-red-500">{errors.estimatedCost.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actualCost">Actual Cost (Optional)</Label>
                  <Input
                    id="actualCost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("actualCost")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  defaultValue="USD"
                  onValueChange={(value) => setValue("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Budget Item"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}