"use client"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "@/components/session-provider"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/layout"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"

export default function Home() {
  const { session, loading } = useSession()
  const router = useRouter()

  // Redirect to dashboard if logged in
  if (!loading && session) {
    router.push("/dashboard")
    return null
  }

  return (
    <Layout>
      <Head>
        <title>Travel Itinerary Planner</title>
        <meta name="description" content="Plan your trips with ease" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero
        title="Plan Your Perfect Trip"
        subtitle="Create detailed travel itineraries, collaborate with friends, track your budget, and access your plans offline."
        image="/images/trip.jpg"
      >
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </Hero>

      <Features />
    </Layout>
  )
}
