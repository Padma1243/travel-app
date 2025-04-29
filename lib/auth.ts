import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import prisma from "./prisma"
import { NextApiRequest, NextApiResponse } from "next"

// Hash password (for user registration)
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

// Verify password (during login)
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

// Create JWT Token
export function createToken(userId: string): string {
  return sign({ userId }, process.env.JWT_SECRET || "supersecret", { expiresIn: "7d" })
}

// Verify JWT Token
export function verifyToken(token: string): string | null {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || "supersecret")
    return (decoded as { userId: string }).userId // Return userId from the decoded token
  } catch (error) {
    return null // If token is invalid or expired, return null
  }
}

// Get user from token
export async function getUserFromToken(token: string) {
  const userId = verifyToken(token)
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, avatarUrl: true },
  })

  return user
}

// Protect routes with JWT authentication
export function withAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const user = await getUserFromToken(token)

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    req.user = user // Attach user to request object
    return handler(req, res)
  }
}
