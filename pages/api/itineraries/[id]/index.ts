import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req
  const { id } = req.query
  const itineraryId = String(id)

  try {
    // Check user's permission for this itinerary
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        OR: [
          { ownerId: String(user.id) },
          { collaborators: { some: { userId: String(user.id) } } },
        ],
      },
      include: {
        destinations: true,
        activities: true,
        collaborators: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
      },
    })

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found or access denied" })
    }

    if (req.method === "GET") {
      return res.status(200).json(itinerary)
    }

    // For PUT and DELETE, check if user has edit permissions
    const hasEditPermission = itinerary.ownerId === user.id||
      itinerary.collaborators.some(c => 
        c.userId === user.id && ["edit", "admin"].includes(c.permission)
      )

    if (!hasEditPermission) {
      return res.status(403).json({ message: "You don't have permission to modify this itinerary" })
    }

    if (req.method === "PUT") {
      const updatedItinerary = await prisma.itinerary.update({
        where: { id: itineraryId },
        data: req.body,
        include: {
          destinations: true,
          activities: true,
          budgetItems: true,
          collaborators: {
            include: {
              user: {
                select: { id: true, name: true, email: true, avatarUrl: true },
              },
            },
          },
        },
      })
      return res.status(200).json(updatedItinerary)
    }

    if (req.method === "DELETE") {
      await prisma.itinerary.delete({
        where: { id: itineraryId },
      })
      return res.status(200).json({ message: "Itinerary deleted successfully" })
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error) {
    console.error("Itinerary operation error:", error)
    return res.status(500).json({ message: "Server error" })
  }
}

export default withAuth(handler)