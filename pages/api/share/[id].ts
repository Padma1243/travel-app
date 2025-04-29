import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { id } = req.query
  const itineraryId = Number.parseInt(id as string, 10)

  if (isNaN(itineraryId)) {
    return res.status(400).json({ message: "Invalid itinerary ID" })
  }

  try {
    // Only fetch public itineraries
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        isPublic: true,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        destinations: {
          include: {
            activities: true,
            accommodations: true,
          },
        },
        activities: {
          include: {
            destination: true,
          },
        },
        accommodations: true,
        transportation: {
          include: {
            fromDestination: true,
            toDestination: true,
          },
        },
        budgetItems: true,
      },
    })

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found or not public" })
    }

    return res.status(200).json(itinerary)
  } catch (error) {
    console.error("Error fetching shared itinerary:", error)
    return res.status(500).json({ message: "Failed to fetch itinerary" })
  }
}
