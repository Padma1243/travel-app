import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"
import type { Prisma } from "@prisma/client"

// Define types for budget items
interface BudgetItem {
  id: string
  estimatedCost: Prisma.Decimal
  actualCost: Prisma.Decimal | null
  category: string
  title: string
  description?: string | null
  currency: string
}

const itinerarySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date"),
  isPublic: z.boolean().default(false),
})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user } = req
    
    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (req.method === "GET") {
      const itineraries = await prisma.itinerary.findMany({
        where: {
          OR: [
            { ownerId: user.id },
            { collaborators: { some: { userId: user.id } } }
          ]
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          },
          destinations: {
            select: {
              id: true,
              name: true,
              address: true,
              latitude: true,
              longitude: true
            }
          },
          activities: {
            select: {
              id: true,
              title: true,
              startTime: true,
              endTime: true
            }
          },
          budgetItems: true,
          collaborators: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatarUrl: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Format the response data with proper typing
      const formattedItineraries = itineraries.map(itinerary => ({
        ...itinerary,
        budgetItems: (itinerary.budgetItems as BudgetItem[]).map((item: BudgetItem) => ({
          ...item,
          estimatedCost: Number(item.estimatedCost),
          actualCost: item.actualCost ? Number(item.actualCost) : null
        }))
      }))

      return res.status(200).json(formattedItineraries)
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
            budgetItems: true,
            owner: {
              select: { id: true, name: true, email: true }
            }
          }
        })
        return res.status(201).json(itinerary)
      } catch (error) {
        console.error("Error creating itinerary:", error)
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Invalid request data",
            errors: error.errors
          })
        }
        const errorMessage = error instanceof Error ? error.message : "Failed to create itinerary"
        return res.status(500).json({ message: errorMessage })
      }
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error) {
    console.error("API Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    })
  }
}

export default withAuth(handler)
