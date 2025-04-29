import type { NextApiRequest, NextApiResponse } from "next"
import { createUser, getUserByEmail } from "@/lib/db"
import { createToken } from "@/lib/auth"
import { serialize } from "cookie"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    // Create new user
    const user = await createUser({ name, email, password })

    // Create auth token and set cookie
    const token = createToken(String(user.id))
    res.setHeader(
      "Set-Cookie",
      serialize("auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      })
    )

    // Return user data and token
    const { password: _, ...userWithoutPassword } = user
    return res.status(201).json({ 
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error("Registration error:", error)
    return res.status(500).json({ message: "Failed to register user" })
  }
}
