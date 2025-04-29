import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import { syncOfflineChanges } from "@/lib/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { changes } = req.body

    if (!Array.isArray(changes) || changes.length === 0) {
      return res.status(400).json({ message: "No changes to sync" })
    }

    // Save changes to offline_sync table
    await syncOfflineChanges(Number(user.id))

    return res.status(200).json({ message: "Changes synced successfully" })
  } catch (error) {
    console.error("Sync error:", error)
    return res.status(500).json({ message: "Failed to sync changes" })
  }
}

export default withAuth(handler)
