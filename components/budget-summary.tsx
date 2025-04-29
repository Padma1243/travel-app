"use client"

import { useMemo } from "react"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface BudgetSummaryProps {
  budgetItems?: any[]
  activities?: any[]
  accommodations?: any[]
  transportation?: any[]
  detailed?: boolean | null
}

export function BudgetSummary({
  budgetItems = [],
  activities = [],
  accommodations = [],
  transportation = [],
  detailed = false,
}: BudgetSummaryProps) {
  const summary = useMemo(() => {
    // Calculate totals from budget items
    const totalEstimated = budgetItems.reduce((sum, item) => sum + (Number(item?.estimatedCost) || 0), 0)
    const totalActual = budgetItems.reduce((sum, item) => sum + (Number(item?.actualCost) || 0), 0)

    // Calculate totals from activities, accommodations, and transportation
    const activityTotal = activities.reduce((sum, item) => sum + (Number(item?.cost) || 0), 0)
    const accommodationTotal = accommodations.reduce((sum, item) => sum + (Number(item?.cost) || 0), 0)
    const transportationTotal = transportation.reduce((sum, item) => sum + (Number(item?.cost) || 0), 0)

    // Calculate category totals from budget items
    const categories = budgetItems.reduce((acc: Record<string, { estimated: number; actual: number }>, item) => {
      const category = item?.category || 'other'
      if (!acc[category]) {
        acc[category] = { estimated: 0, actual: 0 }
      }
      acc[category].estimated += Number(item?.estimatedCost) || 0
      acc[category].actual += Number(item?.actualCost) || 0
      return acc
    }, {})

    return {
      totalEstimated,
      totalActual,
      activityTotal,
      accommodationTotal,
      transportationTotal,
      categories,
      difference: totalEstimated - totalActual,
      percentSpent: totalEstimated > 0 ? (totalActual / totalEstimated) * 100 : 0,
    }
  }, [budgetItems, activities, accommodations, transportation])

  if (!detailed) {
    // Simple summary view
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Estimated Budget</div>
              <div className="text-2xl font-bold">${summary.totalEstimated.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Actual Spent</div>
              <div className="text-2xl font-bold">${summary.totalActual.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Budget Progress</span>
            <span>
              {summary.percentSpent.toFixed(0)}% (${summary.totalActual.toFixed(2)} of $
              {summary.totalEstimated.toFixed(2)})
            </span>
          </div>
          <Progress value={summary.percentSpent} className="h-2" />
        </div>

        {summary.totalEstimated > 0 && (
          <div className="flex items-center justify-center">
            {summary.difference > 0 ? (
              <div className="flex items-center text-green-500">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">${summary.difference.toFixed(2)} under budget</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">${Math.abs(summary.difference).toFixed(2)} over budget</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Detailed budget view
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Estimated Budget</div>
                <div className="text-2xl font-bold">${summary.totalEstimated.toFixed(2)}</div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Actual Spent</div>
                <div className="text-2xl font-bold">${summary.totalActual.toFixed(2)}</div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  {summary.difference >= 0 ? "Remaining" : "Overspent"}
                </div>
                <div className={`text-2xl font-bold ${summary.difference >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${Math.abs(summary.difference).toFixed(2)}
                </div>
              </div>
              {summary.difference >= 0 ? (
                <TrendingDown className="h-8 w-8 text-green-500/50" />
              ) : (
                <TrendingUp className="h-8 w-8 text-red-500/50" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Budget Progress</span>
          <span>
            {summary.percentSpent.toFixed(0)}% (${summary.totalActual.toFixed(2)} of $
            {summary.totalEstimated.toFixed(2)})
          </span>
        </div>
        <Progress value={summary.percentSpent} className={`h-2 ${summary.percentSpent > 100 ? "bg-red-200" : ""}`} />
      </div>

      {/* Category breakdown */}
      {Object.keys(summary.categories).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Budget Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(summary.categories).map(([category, values]) => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium capitalize">{category}</span>
                  <span>
                    ${values.actual.toFixed(2)} of ${values.estimated.toFixed(2)}
                  </span>
                </div>
                <Progress
                  value={(values.actual / values.estimated) * 100}
                  className={`h-1.5 ${values.actual > values.estimated ? "bg-red-200" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional costs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Activities</div>
            <div className="text-xl font-bold">${summary.activityTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Accommodations</div>
            <div className="text-xl font-bold">${summary.accommodationTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Transportation</div>
            <div className="text-xl font-bold">${summary.transportationTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Budget items list */}
      {detailed && budgetItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Budget Items</h3>
          <div className="border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2 pl-4">Item</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-right p-2">Estimated</th>
                  <th className="text-right p-2 pr-4">Actual</th>
                </tr>
              </thead>
              <tbody>
                {budgetItems.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="p-2 pl-4">
                      <div className="font-medium">{item.title}</div>
                      {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                    </td>
                    <td className="p-2 capitalize">{item.category}</td>
                    <td className="p-2 text-right">${Number(item.estimatedCost).toFixed(2)}</td>
                    <td className="p-2 pr-4 text-right">
                      {item.actualCost ? `$${Number(item.actualCost).toFixed(2)}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
