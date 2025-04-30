import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req
  const { id } = req.query
  
  // Remove the parseInt since we're using string IDs
  const itineraryId = id as string

  // Check if user has permission to access this itinerary
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: itineraryId,
      OR: [
        { ownerId: user.id },
        { collaborators: { some: { userId: user.id } } }
      ],
    },
  })

  if (!itinerary) {
    return res.status(403).json({ message: "Not authorized or itinerary not found" })
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
          currency,
          itineraryId,
        },
      })

      return res.status(201).json(budgetItem)
    } catch (error) {
      console.error("Error creating budget item:", error)
      return res.status(500).json({ message: "Failed to create budget item" })
    }
  }

  // GET - Fetch budget items
  if (req.method === "GET") {
    try {
      const budgetItems = await prisma.budgetItem.findMany({
        where: { itineraryId },
        orderBy: { createdAt: "desc" },
      })

      return res.status(200).json({ budgetItems })
    } catch (error) {
      console.error("Error fetching budget items:", error)
      return res.status(500).json({ message: "Failed to fetch budget items" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default withAuth(handler)