import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req
  const { id, activityId } = req.query
  const itineraryId = String(id)
  const activityIdStr = String(activityId)

  // Check if user has permission
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: itineraryId,
      OR: [
        { ownerId: String(user.id) },
        { 
          collaborators: { 
            some: { 
              userId: String(user.id), 
              permission: { in: ["edit", "admin"] } 
            } 
          } 
        },
      ],
    },
  })

  if (!itinerary) {
    return res.status(403).json({ message: "Not authorized or itinerary not found" })
  }

  // Check if activity exists and belongs to the itinerary
  const activity = await prisma.activity.findFirst({
    where: {
      id: activityIdStr,
      itineraryId,
    },
  })

  if (!activity) {
    return res.status(404).json({ message: "Activity not found" })
  }

  if (req.method === "PUT") {
    try {
      const updatedActivity = await prisma.activity.update({
        where: { id: activityIdStr },
        data: {
          ...req.body,
          destinationId: req.body.destinationId ? String(req.body.destinationId) : undefined,
        },
      })
      return res.status(200).json(updatedActivity)
    } catch (error) {
      console.error("Error updating activity:", error)
      return res.status(500).json({ message: "Failed to update activity" })
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.activity.delete({
        where: { id: activityIdStr },
      })
      return res.status(200).json({ message: "Activity deleted successfully" })
    } catch (error) {
      console.error("Error deleting activity:", error)
      return res.status(500).json({ message: "Failed to delete activity" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default withAuth(handler)
