"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession } from "./session-provider"
import { useToast } from "./ui/use-toast"

interface OfflineContextType {
  isOnline: boolean
  saveOfflineData: (entityType: string, entityId: number, action: string, data: any) => void
  syncOfflineData: () => Promise<void>
}

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  saveOfflineData: () => {},
  syncOfflineData: async () => {},
})

export function useOffline() {
  return useContext(OfflineContext)
}

interface OfflineProviderProps {
  children: ReactNode
}

export function OfflineProvider({ children }: OfflineProviderProps) {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true)
  const { session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "You are back online",
        description: "Syncing your changes...",
      })
      syncOfflineData()
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You are offline",
        description: "Changes will be saved locally and synced when you reconnect.",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const saveOfflineData = (entityType: string, entityId: number, action: string, data: any) => {
    if (!session) return

    const offlineChanges = JSON.parse(localStorage.getItem("offlineChanges") || "[]")
    offlineChanges.push({
      userId: session.user.id,
      entityType,
      entityId,
      action,
      data,
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem("offlineChanges", JSON.stringify(offlineChanges))
  }

  const syncOfflineData = async () => {
    if (!isOnline || !session) return

    const offlineChanges = JSON.parse(localStorage.getItem("offlineChanges") || "[]")
    if (offlineChanges.length === 0) return

    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes: offlineChanges }),
      })

      if (response.ok) {
        localStorage.removeItem("offlineChanges")
        toast({
          title: "Sync complete",
          description: `Successfully synced ${offlineChanges.length} changes.`,
        })
      } else {
        throw new Error("Failed to sync changes")
      }
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Could not sync your offline changes. Will try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <OfflineContext.Provider value={{ isOnline, saveOfflineData, syncOfflineData }}>{children}</OfflineContext.Provider>
  )
}
