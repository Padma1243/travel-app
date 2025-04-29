import type { NextApiRequest, NextApiResponse } from "next"
import { withAuth } from "@/lib/auth"
import formidable from "formidable"
import fs from "fs/promises"
import path from "path"

export const config = {
  api: {
    bodyParser: false,
  },
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadDir, { recursive: true })

    const form = formidable({
      uploadDir,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filename: (_name, _ext, part) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        return `avatar-${uniqueSuffix}${path.extname(part.originalFilename || '')}`
      },
      filter: ({ mimetype }) => {
        return mimetype?.includes("image") || false
      }
    })

    const [_, files] = await form.parse(req)
    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ message: "No image file provided" })
    }

    // Return the relative URL for the uploaded file
    const relativeUrl = `/uploads/${path.basename(file.filepath)}`
    return res.status(200).json({ url: relativeUrl })

  } catch (error) {
    console.error("Avatar upload error:", error)
    return res.status(500).json({ message: "Failed to upload avatar" })
  }
}

export default withAuth(handler)