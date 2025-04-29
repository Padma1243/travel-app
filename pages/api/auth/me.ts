import type { NextApiRequest, NextApiResponse } from "next"
import { verify } from "jsonwebtoken"
import prisma from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Not authenticated" })
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET || "supersecret") as { userId: string }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, avatarUrl: true },
    })
    
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    
    return res.status(200).json({ user })
  } catch (error) {
    console.error("Auth error:", error)
    return res.status(401).json({ message: "Not authenticated" })
  }
}
