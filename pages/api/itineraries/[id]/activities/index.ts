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
        { ownerId: user.id },
        { collaborators: { some: { userId: user.id } } }
      ],
    },
  })

  if (!itinerary) {
    return res.status(403).json({ message: "Not authorized or itinerary not found" })
  }

  // GET - Fetch activities
  if (req.method === "GET") {
    try {
      const activities = await prisma.activity.findMany({
        where: { itineraryId },
        include: {
          destination: true,
        },
        orderBy: { startTime: "asc" },
      })

      return res.status(200).json(activities)
    } catch (error) {
      console.error("Error fetching activities:", error)
      return res.status(500).json({ message: "Failed to fetch activities" })
    }
  }

  // POST - Create new activity
  if (req.method === "POST") {
    try {
      const { title, description, destinationId, startTime, endTime, cost, currency } = req.body

      if (!title) {
        return res.status(400).json({ message: "Title is required" })
      }

      // Check if destination exists and belongs to the itinerary
      if (destinationId) {
        const destination = await prisma.destination.findFirst({
          where: {
            id: destinationId,
            itineraryId,
          },
        })

        if (!destination) {
          return res.status(400).json({ message: "Destination not found or does not belong to this itinerary" })
        }
      }

      const activity = await prisma.activity.create({
        data: {
          itineraryId,
          title,
          description,
          destinationId,
          startTime,
          endTime,
          cost,
          currency: currency || "USD",
        },
        include: {
          destination: true,
        },
      })

      return res.status(201).json(activity)
    } catch (error) {
      console.error("Error creating activity:", error)
      return res.status(500).json({ message: "Failed to create activity" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default withAuth(handler)
