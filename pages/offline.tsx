import Head from "next/head"
import Link from "next/link"
import { WifiOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/layout"

export default function Offline() {
  return (
    <Layout>
      <Head>
        <title>Offline | Travel Itinerary Planner</title>
      </Head>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
        <div className="p-4 rounded-full bg-muted mb-6">
          <WifiOff className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">You're offline</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          It looks like you're not connected to the internet. Some features may be unavailable until you reconnect.
        </p>
        <div className="space-y-4">
          <p className="text-sm">
            Don't worry, any changes you make while offline will be synced when you reconnect.
          </p>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </Layout>
  )
}
