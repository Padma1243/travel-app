import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req
  const { id, destinationId } = req.query
  const itineraryId = String(id)
  const destId = String(destinationId)

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

  // Check if destination exists and belongs to the itinerary
  const destination = await prisma.destination.findFirst({
    where: {
      id: destId,
      itineraryId,
    },
  })

  if (!destination) {
    return res.status(404).json({ message: "Destination not found" })
  }

  if (req.method === "GET") {
    return res.status(200).json(destination)
  }

  if (req.method === "PUT") {
    try {
      const updatedDestination = await prisma.destination.update({
        where: { id: destId },
        data: req.body,
      })
      return res.status(200).json(updatedDestination)
    } catch (error) {
      console.error("Error updating destination:", error)
      return res.status(500).json({ message: "Failed to update destination" })
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.destination.delete({
        where: { id: destId },
      })
      return res.status(200).json({ message: "Destination deleted successfully" })
    } catch (error) {
      console.error("Error deleting destination:", error)
      return res.status(500).json({ message: "Failed to delete destination" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default withAuth(handler)
