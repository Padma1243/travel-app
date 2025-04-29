"use client"

import { Calendar, Clock, CreditCard, Globe, Map, Share2, Smartphone, Users } from 'lucide-react'

interface FeatureItem {
  icon: React.ElementType
  title: string
  description: string
}

const features: FeatureItem[] = [
  {
    icon: Map,
    title: "Interactive Trip Planning",
    description:
      "Create detailed itineraries with destinations, activities, accommodations, and transportation all in one place.",
  },
  {
    icon: Users,
    title: "Collaborative Planning",
    description: "Invite friends and family to view and edit your travel plans for seamless group trip coordination.",
  },
  {
    icon: CreditCard,
    title: "Budget Tracking",
    description:
      "Keep track of estimated and actual expenses for your trip, categorized by accommodations, activities, and more.",
  },
  {
    icon: Calendar,
    title: "Timeline View",
    description: "Visualize your trip day by day with an intuitive timeline showing all your planned activities.",
  },
  {
    icon: Globe,
    title: "Interactive Maps",
    description: "See all your destinations on an interactive map to better plan your routes and travel times.",
  },
  {
    icon: Smartphone,
    title: "Offline Access",
    description: "Access your travel plans even without internet connection, perfect for international travel.",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Make changes to your itinerary on the go and keep everyone in your group informed in real-time.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your itineraries with others via link, even if they don't have an account.",
  },
]

export function Features() {
  return (
    <section className="container px-4 md:px-6 py-12 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Features</h2>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Everything you need to plan the perfect trip, all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg transition-all">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 md:mt-24 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to start planning your next adventure?</h3>
        <div className="inline-flex gap-4">
          <a
            href="/register"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Get Started
          </a>
          <a
            href="/features"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  )
}
