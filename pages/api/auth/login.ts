import type { NextApiRequest, NextApiResponse } from "next"
import { getUserByEmail } from "@/lib/db"
import { verifyPassword, createToken } from "@/lib/auth"
import { runCorsMiddleware } from '@/lib/cors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // Run the CORS middleware
  await runCorsMiddleware(req, res) 
  
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { email, password } = req.body

    // Find user by email
    const user = await getUserByEmail(email)
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Create auth token with string ID
    const token = createToken(String(user.id))

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user
    return res.status(200).json({ 
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ message: "Failed to authenticate" })
  }
}
