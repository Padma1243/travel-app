import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req
  const { id, budgetItemId } = req.query
  const itineraryId = id as string
  const itemId = budgetItemId as string

  if (!itineraryId || !itemId) {
    return res.status(400).json({ message: "Invalid ID" })
  }

  // Check if user has permission to access this itinerary
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: itineraryId,
      OR: [
        { ownerId: user.id },
        { collaborators: { some: { userId: user.id, permission: { in: ["edit", "admin"] } } } }
      ],
    },
  })

  if (!itinerary) {
    return res.status(403).json({ message: "Not authorized or itinerary not found" })
  }

  // Check if budget item exists and belongs to the itinerary
  const budgetItem = await prisma.budgetItem.findFirst({
    where: {
      id: itemId,
      itineraryId,
    },
  })

  if (!budgetItem) {
    return res.status(404).json({ message: "Budget item not found" })
  }

  // GET - Fetch single budget item
  if (req.method === "GET") {
    try {
      const budgetItem = await prisma.budgetItem.findUnique({
        where: { 
          id: itemId,
        },
        include: {
          itinerary: {
            select: {
              title: true,
              startDate: true,
              endDate: true,
              owner: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      })

      if (!budgetItem) {
        return res.status(404).json({ 
          success: false,
          message: "Budget item not found" 
        })
      }

      // Format the response
      const formattedBudgetItem = {
        ...budgetItem,
        estimatedCost: Number(budgetItem.estimatedCost),
        actualCost: budgetItem.actualCost ? Number(budgetItem.actualCost) : null,
      }

      return res.status(200).json({
        success: true,
        data: formattedBudgetItem
      })
    } catch (error) {
      console.error("Error fetching budget item:", error)
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch budget item" 
      })
    }
  }

  // PUT - Update budget item
  if (req.method === "PUT") {
    try {
      const { category, title, description, estimatedCost, actualCost, currency } = req.body

      if (!title || !category || estimatedCost === undefined) {
        return res.status(400).json({ message: "Missing required fields" })
      }

      const updatedBudgetItem = await prisma.budgetItem.update({
        where: { id: itemId },
        data: {
          category,
          title,
          description,
          estimatedCost,
          actualCost,
          currency: currency || "USD",
        },
      })

      return res.status(200).json(updatedBudgetItem)
    } catch (error) {
      console.error("Error updating budget item:", error)
      return res.status(500).json({ message: "Failed to update budget item" })
    }
  }

  // DELETE - Delete budget item
  if (req.method === "DELETE") {
    try {
      await prisma.budgetItem.delete({
        where: { id: itemId },
      })

      return res.status(200).json({ message: "Budget item deleted successfully" })
    } catch (error) {
      console.error("Error deleting budget item:", error)
      return res.status(500).json({ message: "Failed to delete budget item" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default withAuth(handler)