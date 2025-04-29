import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { verifyPassword, hashPassword } from "@/lib/auth"

interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;  // Assumed to be a string (UUID, etc.)
    name: string;
    email: string;
    avatarUrl?: string;
  }
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { user } = req

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { name, avatarUrl, currentPassword, newPassword } = req.body
    const updateData: Partial<{
      name: string;
      avatarUrl: string;
      password: string;
    }> = {}

    // Use user.id directly if it's a string (e.g., UUID)
    const userId = user.id

    // Update name if provided
    if (name) {
      updateData.name = name
    }

    // Update avatar if provided
    if (avatarUrl) {
      updateData.avatarUrl = avatarUrl
    }

    // Handle password change if both passwords are provided
    if (currentPassword && newPassword) {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },  // Use the userId as a string directly
        select: { password: true },
      })

      const isValid = await verifyPassword(currentPassword, dbUser?.password || '')
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" })
      }

      updateData.password = await hashPassword(newPassword)
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },  // Use userId as a string (no need to convert)
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    })

    return res.status(200).json({ user: updatedUser })
  } catch (error) {
    console.error("Profile update error:", error)
    return res.status(500).json({ message: "Failed to update profile" })
  }
}

export default withAuth(handler)
