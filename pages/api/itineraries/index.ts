import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { withAuth } from "@/lib/auth" // Add this import

const itinerarySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date"),
  isPublic: z.boolean().default(false),
})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req // Get user from withAuth middleware

  if (req.method === "GET") {
    try {
      const itineraries = await prisma.itinerary.findMany({
        where: {
          OR: [
            { ownerId: user.id },
            { collaborators: { some: { userId: user.id } } }
          ]
        },
        include: {
          destinations: true,
          activities: true,
          owner: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(itineraries)
    } catch (error: any) {
      console.error("Error fetching itineraries:", error)
      return res.status(500).json({ message: "Failed to fetch itineraries" })
    }
  }

  if (req.method === "POST") {
    try {
      const validatedData = itinerarySchema.parse(req.body)

      const itinerary = await prisma.itinerary.create({
        data: {
          ...validatedData,
          owner: {
            connect: { id: user.id }
          }
        },
        include: {
          destinations: true,
          activities: true,
          owner: {
            select: { id: true, name: true, email: true }
          }
        }
      })
      return res.status(201).json(itinerary)
    } catch (error: any) {
      console.error("Error creating itinerary:", error)
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: error.errors
        })
      }
      return res.status(500).json({ message: "Failed to create itinerary" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

export default withAuth(handler)
