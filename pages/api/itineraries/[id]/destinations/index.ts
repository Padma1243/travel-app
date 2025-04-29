import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req
  const { id } = req.query
  const itineraryId = String(id)

  // Check if user has permission to access this itinerary
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: itineraryId,
      OR: [
        { ownerId: String(user.id) },
        { collaborators: { some: { userId: String(user.id), permission: { in: ["edit", "admin"] } } } },
      ],
    },
  })

  if (!itinerary) {
    return res.status(403).json({ message: "Not authorized or itinerary not found" })
  }

  if (req.method === "GET") {
    try {
      const destinations = await prisma.destination.findMany({
        where: { itineraryId },
        orderBy: { startDate: "asc" },
      })
      return res.status(200).json(destinations)
    } catch (error) {
      console.error("Error fetching destinations:", error)
      return res.status(500).json({ message: "Failed to fetch destinations" })
    }
  }

  if (req.method === "POST") {
    try {
      const destination = await prisma.destination.create({
        data: {
          ...req.body,
          itineraryId,
        },
      })
      return res.status(201).json(destination)
    } catch (error) {
      console.error("Error creating destination:", error)
      return res.status(500).json({ message: "Failed to create destination" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default withAuth(handler)
