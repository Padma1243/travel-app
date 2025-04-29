import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req
  const { id, collaboratorId } = req.query
  const itineraryId = String(id)
  const collabId = String(collaboratorId)

  // Check if user is the owner or admin collaborator
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: itineraryId,
      OR: [
        { ownerId: String(user.id) },
        { collaborators: { some: { userId: String(user.id), permission: "admin" } } },
      ],
    },
  })

  if (!itinerary) {
    return res.status(403).json({ message: "Not authorized or itinerary not found" })
  }

  // Check if collaborator exists and belongs to the itinerary
  const collaborator = await prisma.collaborator.findFirst({
    where: {
      id: collabId,
      itineraryId,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  })

  if (!collaborator) {
    return res.status(404).json({ message: "Collaborator not found" })
  }

  if (req.method === "GET") {
    return res.status(200).json(collaborator)
  }

  if (req.method === "PUT") {
    try {
      const { permission } = req.body

      // Validate permission
      if (!["view", "edit", "admin"].includes(permission)) {
        return res.status(400).json({ message: "Invalid permission" })
      }

      const updatedCollaborator = await prisma.collaborator.update({
        where: { id: collabId },
        data: { permission },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      })

      return res.status(200).json(updatedCollaborator)
    } catch (error) {
      console.error("Error updating collaborator:", error)
      return res.status(500).json({ message: "Failed to update collaborator" })
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.collaborator.delete({
        where: { id: collabId },
      })
      return res.status(200).json({ message: "Collaborator removed successfully" })
    } catch (error) {
      console.error("Error removing collaborator:", error)
      return res.status(500).json({ message: "Failed to remove collaborator" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default withAuth(handler)
