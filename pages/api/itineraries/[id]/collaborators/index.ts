import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Replace the missing AuthenticatedRequest with an interface extension
interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    // Add other user properties you need
  }
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { user } = req
  const { id } = req.query
  const itineraryId = String(id) // Keep as string throughout

  // Check if user is the owner of the itinerary
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: itineraryId,
      ownerId: user.id,
    },
  })

  if (!itinerary) {
    return res.status(403).json({ message: "Not authorized or itinerary not found" })
  }

  if (req.method === "POST") {
    try {
      const { email, permission } = req.body

      if (!email) {
        return res.status(400).json({ message: "Email is required" })
      }

      if (!["view", "edit", "admin"].includes(permission)) {
        return res.status(400).json({ message: "Invalid permission" })
      }

      const collaboratorUser = await prisma.user.findUnique({
        where: { email },
      })

      if (!collaboratorUser) {
        return res.status(404).json({ message: "User not found" })
      }

      const existingCollaborator = await prisma.collaborator.findFirst({
        where: {
          itineraryId: String(itineraryId), // Convert to string
          userId: collaboratorUser.id,
        },
      })

      if (existingCollaborator) {
        return res.status(400).json({ message: "User is already a collaborator" })
      }

      const collaborator = await prisma.collaborator.create({
        data: {
          itineraryId: String(itineraryId), // Convert to string
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

  if (req.method === "GET") {
    try {
      const collaborators = await prisma.collaborator.findMany({
        where: { itineraryId: String(itineraryId) }, // Convert to string
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

      return res.status(200).json(collaborators)
    } catch (error) {
      console.error("Error fetching collaborators:", error)
      return res.status(500).json({ message: "Failed to fetch collaborators" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default withAuth(handler)