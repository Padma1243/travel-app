import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const itineraryId = String(id)

  if (req.method === "GET") {
    try {
      const budgetItems = await prisma.budgetItem.findMany({
        where: { itineraryId },
        orderBy: { createdAt: 'desc' }
      })

      // Format the numbers before sending
      const formattedBudgetItems = budgetItems.map(item => ({
        ...item,
        estimatedCost: Number(item.estimatedCost),
        actualCost: item.actualCost ? Number(item.actualCost) : null
      }))

      return res.status(200).json(formattedBudgetItems)
    } catch (error) {
      console.error("Error fetching budget items:", error)
      return res.status(500).json({ message: "Failed to fetch budget items" })
    }
  }

  // POST - Create new budget item
  if (req.method === "POST") {
    try {
      const { category, title, description, estimatedCost, actualCost, currency } = req.body

      const budgetItem = await prisma.budgetItem.create({
        data: {
          category,
          title,
          description,
          estimatedCost,
          actualCost,
          currency: currency || "USD",
          itineraryId,
        },
      })

      return res.status(201).json(budgetItem)
    } catch (error) {
      console.error("Error creating budget item:", error)
      return res.status(500).json({ message: "Failed to create budget item" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default withAuth(handler)