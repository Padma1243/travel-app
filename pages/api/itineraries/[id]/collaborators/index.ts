import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
  }
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { user } = req
  const { id } = req.query
  const itineraryId = String(id)

  // Check if user has permission to access this itinerary
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: itineraryId,
      OR: [
        { ownerId: user.id },
        { collaborators: { some: { userId: user.id, permission: "admin" } } }
      ],
    },
  })

  if (!itinerary) {
    return res.status(403).json({ message: "Not authorized or itinerary not found" })
  }

  if (req.method === "POST") {
    try {
      const { email, permission } = req.body

      if (!email || !permission) {
        return res.status(400).json({ message: "Email and permission are required" })
      }

      // Find the user to be added as collaborator
      const collaboratorUser = await prisma.user.findUnique({
        where: { email },
      })

      if (!collaboratorUser) {
        return res.status(404).json({ message: "User not found" })
      }

      // Check if already a collaborator
      const existingCollaborator = await prisma.collaborator.findFirst({
        where: {
          itineraryId,
          userId: collaboratorUser.id,
        },
      })

      if (existingCollaborator) {
        return res.status(400).json({ message: "User is already a collaborator" })
      }

      const collaborator = await prisma.collaborator.create({
        data: {
          itineraryId,
          userId: collaboratorUser.id,
          permission,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      })

      return res.status(201).json(collaborator)
    } catch (error) {
      console.error("Error adding collaborator:", error)
      return res.status(500).json({ message: "Failed to add collaborator" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default withAuth(handler)