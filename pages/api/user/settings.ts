import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const settings = await prisma.userSettings.findUnique({
          where: { userId: user.id },
        });

        return res.status(200).json(settings);
      }

      case "POST": {
        const existing = await prisma.userSettings.findUnique({
          where: { userId: user.id },
        });

        if (existing) {
          return res.status(200).json(existing);
        }

        const defaultSettings = await prisma.userSettings.create({
          data: {
            userId: user.id,
            emailNotifications: true,
            pushNotifications: true,
            tripReminders: true,
            marketingEmails: false,
            profileVisibility: "public",
            theme: "system",
            language: "en",
          },
        });

        return res.status(201).json(defaultSettings);
      }

      case "PUT": {
        const {
          emailNotifications,
          pushNotifications,
          tripReminders,
          marketingEmails,
          profileVisibility,
          theme,
          language,
        } = req.body;

        const updated = await prisma.userSettings.upsert({
          where: { userId: user.id },
          update: {
            emailNotifications,
            pushNotifications,
            tripReminders,
            marketingEmails,
            profileVisibility,
            theme,
            language,
          },
          create: {
            userId: user.id,
            emailNotifications,
            pushNotifications,
            tripReminders,
            marketingEmails,
            profileVisibility,
            theme,
            language,
          },
        });

        return res.status(200).json(updated);
      }

      case "DELETE": {
        await prisma.userSettings.delete({
          where: { userId: user.id },
        });

        return res.status(200).json({ message: "User settings deleted." });
      }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Settings API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
