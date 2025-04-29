"use client"

import { useState, useEffect } from "react"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "@/components/session-provider"
import { LoadingScreen } from "@/components/loading-screen"
import { OfflineProvider } from "@/components/offline-provider"
import "@/styles/globals.css"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    router.events.on("routeChangeStart", handleStart)
    router.events.on("routeChangeComplete", handleComplete)
    router.events.on("routeChangeError", handleComplete)

    return () => {
      router.events.off("routeChangeStart", handleStart)
      router.events.off("routeChangeComplete", handleComplete)
      router.events.off("routeChangeError", handleComplete)
    }
  }, [router])

  // Register service worker for offline access
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").then(
          (registration) => {
            console.log("ServiceWorker registration successful with scope: ", registration.scope)
          },
          (err) => {
            console.log("ServiceWorker registration failed: ", err)
          },
        )
      })
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <OfflineProvider>
          {loading ? <LoadingScreen /> : <Component {...pageProps} />}
        </OfflineProvider>
        <Toaster />
      </SessionProvider>
    </ThemeProvider>
  )
}

export default MyApp
