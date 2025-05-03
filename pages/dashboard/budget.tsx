"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { DollarSign, Filter, Plus, Trash2 } from "lucide-react"
import { useSession } from "@/components/session-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EmptyState } from "@/components/empty-state"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DeleteDialog } from "@/components/delete-dialog"

interface BudgetItem {
  id: string
  itineraryId: string
  category: string
  title: string
  description: string | null
  estimatedCost: number
  actualCost: number | null
  currency: string
}

interface Itinerary {
  id: string
  title: string
  startDate: string
  endDate: string
}

export default function Budget() {
  const { session } = useSession({ required: true })
  const router = useRouter()
  const { toast } = useToast()
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [selectedItinerary, setSelectedItinerary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentBudgetItem, setCurrentBudgetItem] = useState<BudgetItem | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [formData, setFormData] = useState({
    category: "accommodation",
    title: "",
    description: "",
    estimatedCost: "",
    actualCost: "",
    currency: "USD",
  })

  useEffect(() => {
    if (session) {
      fetchItineraries()
    }
  }, [session])

  useEffect(() => {
    if (selectedItinerary) {
      fetchBudgetItems(selectedItinerary)
    }
  }, [selectedItinerary])

  const fetchItineraries = async () => {
    try {
      const response = await fetch("/api/itineraries")
      if (!response.ok) {
        throw new Error("Failed to fetch itineraries")
      }
      const data = await response.json()
      setItineraries(data)
      setIsLoading(false)

      // Select the first itinerary by default if available
      if (data.length > 0) {
        setSelectedItinerary(String(data[0].id))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your itineraries",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const fetchBudgetItems = async (itineraryId: string) => {
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/budget`)
      if (!response.ok) {
        throw new Error("Failed to fetch budget items")
      }
      const data = await response.json()
      setBudgetItems(data.budgetItems || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load budget items",
        variant: "destructive",
      })
    }
  }

  const handleAddClick = () => {
    setFormData({
      category: "accommodation",
      title: "",
      description: "",
      estimatedCost: "",
      actualCost: "",
      currency: "USD",
    })
    setIsAddDialogOpen(true)
  }

  const handleDeleteClick = (item: BudgetItem) => {
    setCurrentBudgetItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!selectedItinerary || !formData.title || !formData.estimatedCost) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/itineraries/${selectedItinerary}/budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formData.category,
          title: formData.title,
          description: formData.description || null,
          estimatedCost: Number.parseFloat(formData.estimatedCost),
          actualCost: formData.actualCost ? Number.parseFloat(formData.actualCost) : null,
          currency: formData.currency,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add budget item")
      }

      toast({
        title: "Success",
        description: "Budget item added successfully",
      })

      setIsAddDialogOpen(false)
      fetchBudgetItems(selectedItinerary)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add budget item",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!currentBudgetItem) return

    try {
      const response = await fetch(`/api/itineraries/${currentBudgetItem.itineraryId}/budget/${currentBudgetItem.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete budget item")
      }

      toast({
        title: "Success",
        description: "Budget item deleted successfully",
      })

      setIsDeleteDialogOpen(false)
      fetchBudgetItems(currentBudgetItem.itineraryId)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete budget item",
        variant: "destructive",
      })
    }
  }

  const filteredBudgetItems = filter === "all" ? budgetItems : budgetItems.filter((item) => item.category === filter)

  const calculateTotals = () => {
    const totals = budgetItems.reduce(
      (acc, item) => {
        acc.estimated += item.estimatedCost
        acc.actual += item.actualCost || 0
        return acc
      },
      { estimated: 0, actual: 0 },
    )

    return totals
  }

  const calculateCategoryTotals = () => {
    const categories = budgetItems.reduce((acc: Record<string, { estimated: number; actual: number }>, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { estimated: 0, actual: 0 }
      }
      acc[item.category].estimated += item.estimatedCost
      acc[item.category].actual += item.actualCost || 0
      return acc
    }, {})

    return categories
  }

  const totals = calculateTotals()
  const categoryTotals = calculateCategoryTotals()

  if (isLoading) {
    return <DashboardLayout>Loading...</DashboardLayout>
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Budget | Travel Itinerary Planner</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Budget Tracker</h1>
            <p className="text-muted-foreground">Manage and track your travel expenses</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedItinerary || ""} onValueChange={setSelectedItinerary}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select itinerary" />
              </SelectTrigger>
              <SelectContent>
                {itineraries.map((itinerary) => (
                  <SelectItem key={itinerary.id} value={String(itinerary.id)}>
                    {itinerary.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddClick} disabled={!selectedItinerary}>
              <Plus className="h-4 w-4 mr-2" /> Add Expense
            </Button>
          </div>
        </div>

        {!selectedItinerary ? (
          <EmptyState
            title="No itinerary selected"
            description="Please select an itinerary to view and manage its budget"
            icon={<DollarSign className="h-12 w-12" />}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Estimated Budget</CardTitle>
                  <CardDescription>Total planned expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${totals.estimated.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Actual Expenses</CardTitle>
                  <CardDescription>Total spent so far</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${totals.actual.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Remaining</CardTitle>
                  <CardDescription>Budget left to spend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-3xl font-bold ${totals.estimated - totals.actual >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    ${(totals.estimated - totals.actual).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Expense Details</CardTitle>
                    <CardDescription>Breakdown of all your travel expenses</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="food">Food & Dining</SelectItem>
                        <SelectItem value="activities">Activities</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="list">
                  <TabsList className="mb-4">
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="category">By Category</TabsTrigger>
                  </TabsList>

                  <TabsContent value="list">
                    {filteredBudgetItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No budget items found. Add your first expense!</p>
                      </div>
                    ) : (
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="text-left p-3">Item</th>
                              <th className="text-left p-3">Category</th>
                              <th className="text-right p-3">Estimated</th>
                              <th className="text-right p-3">Actual</th>
                              <th className="text-right p-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredBudgetItems.map((item) => (
                              <tr key={item.id} className="border-t">
                                <td className="p-3">
                                  <div className="font-medium">{item.title}</div>
                                  {item.description && (
                                    <div className="text-xs text-muted-foreground">{item.description}</div>
                                  )}
                                </td>
                                <td className="p-3 capitalize">{item.category}</td>
                                <td className="p-3 text-right">
                                  {item.currency} {item.estimatedCost.toFixed(2)}
                                </td>
                                <td className="p-3 text-right">
                                  {item.actualCost !== null ? `${item.currency} ${item.actualCost.toFixed(2)}` : "-"}
                                </td>
                                <td className="p-3 text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteClick(item)}
                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="category">
                    <div className="space-y-6">
                      {Object.keys(categoryTotals).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No budget items found. Add your first expense!</p>
                        </div>
                      ) : (
                        Object.entries(categoryTotals).map(([category, totals]) => (
                          <div key={category} className="border rounded-md p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium capitalize">{category}</h3>
                              <div className="text-sm text-muted-foreground">
                                {totals.actual > 0 ? (
                                  <span>
                                    ${totals.actual.toFixed(2)} of ${totals.estimated.toFixed(2)}
                                  </span>
                                ) : (
                                  <span>Estimated: ${totals.estimated.toFixed(2)}</span>
                                )}
                              </div>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  totals.actual / totals.estimated > 1 ? "bg-red-500" : "bg-primary"
                                }`}
                                style={{
                                  width: `${Math.min((totals.actual / totals.estimated) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Add Budget Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>Add a new expense to your travel budget</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Expense Title</Label>
              <Input
                id="title"
                placeholder="Hotel Booking"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="3 nights at Hilton Hotel"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Estimated Cost</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  placeholder="0.00"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actualCost">Actual Cost (Optional)</Label>
                <Input
                  id="actualCost"
                  type="number"
                  placeholder="0.00"
                  value={formData.actualCost}
                  onChange={(e) => setFormData({ ...formData, actualCost: e.target.value })}
                />
              </div>
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
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Budget Item Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        title="Delete Expense"
        description={`Are you sure you want to delete "${currentBudgetItem?.title || "this expense"}"? This action cannot be undone.`}
      />
    </DashboardLayout>
  )
}
