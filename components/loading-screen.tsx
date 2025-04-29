"use client"

import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="mt-4 text-xl font-semibold">Loading...</h2>
        <p className="mt-2 text-muted-foreground">Preparing your travel experience</p>
      </div>
    </div>
  )
}
