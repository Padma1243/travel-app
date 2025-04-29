import type { NextApiRequest, NextApiResponse } from "next"
import cookie from "cookie"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  // Clear the auth cookie
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("auth", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    }),
  )

  return res.status(200).json({ message: "Logged out successfully" })
}
