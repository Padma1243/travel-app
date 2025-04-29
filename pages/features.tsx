"use client"

import Head from "next/head"
import Link from "next/link"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, CreditCard, Globe, Map, Share2, Smartphone, Users, CheckCircle, Compass, Briefcase, Shield } from 'lucide-react'

export default function Features() {
  return (
    <Layout>
      <Head>
        <title>Features | Travel Itinerary Planner</title>
      </Head>

      <div className="container px-4 md:px-6 py-12 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Powerful Features for Seamless Travel Planning
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover all the tools and features that make Travel Itinerary Planner the perfect companion for your
            adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="flex flex-col items-center text-center p-6">
            <Map className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="mb-2">Interactive Trip Planning</CardTitle>
            <CardDescription>
              Create detailed itineraries with destinations, activities, accommodations, and transportation all in one
              place.
            </CardDescription>
          </Card>

          <Card className="flex flex-col items-center text-center p-6">
            <Users className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="mb-2">Collaborative Planning</CardTitle>
            <CardDescription>
              Invite friends and family to view and edit your travel plans for seamless group trip coordination.
            </CardDescription>
          </Card>

          <Card className="flex flex-col items-center text-center p-6">
            <CreditCard className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="mb-2">Budget Tracking</CardTitle>
            <CardDescription>
              Keep track of estimated and actual expenses for your trip, categorized by accommodations, activities, and
              more.
            </CardDescription>
          </Card>

          <Card className="flex flex-col items-center text-center p-6">
            <Smartphone className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="mb-2">Offline Access</CardTitle>
            <CardDescription>
              Access your travel plans even without internet connection, perfect for international travel.
            </CardDescription>
          </Card>
        </div>

        <Tabs defaultValue="planning" className="mb-16">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="planning">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Effortless Trip Planning</h2>
                <p className="text-muted-foreground mb-6">
                  Our intuitive planning tools make it easy to create detailed itineraries for any type of trip, from
                  weekend getaways to extended international adventures.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Interactive map view with all your destinations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Day-by-day timeline of activities and transportation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Accommodation booking details and check-in reminders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Transportation tracking with confirmation numbers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Activity scheduling with location information</span>
                  </li>
                </ul>
                <Button className="mt-6" asChild>
                  <Link href="/register">Start Planning Now</Link>
                </Button>
              </div>
              <div className="bg-muted rounded-lg p-6 order-first md:order-last">
                <img
                  src="/images/tr-planning.jpeg?height=400&width=600"
                  alt="Trip planning interface"
                  className="rounded-md shadow-lg w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collaboration">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-muted rounded-lg p-6">
                <img
                  src="/images/collaboration.jpeg?height=400&width=600"
                  alt="Collaboration features"
                  className="rounded-md shadow-lg w-full"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Plan Together, Travel Together</h2>
                <p className="text-muted-foreground mb-6">
                  Make travel planning a collaborative experience. Invite friends and family to contribute to your
                  itinerary, ensuring everyone's preferences are considered.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Invite unlimited collaborators (Pro & Business plans)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Set different permission levels for each collaborator</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Real-time updates visible to all collaborators</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Share itineraries via link with non-users</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Export and print itineraries for offline sharing</span>
                  </li>
                </ul>
                <Button className="mt-6" asChild>
                  <Link href="/register">Start Collaborating</Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budget">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Smart Budget Management</h2>
                <p className="text-muted-foreground mb-6">
                  Keep your travel expenses under control with our comprehensive budget tracking tools. Plan ahead and
                  avoid overspending.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Track estimated vs. actual expenses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Categorize expenses for better oversight</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Support for multiple currencies</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Visual budget breakdowns and reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Split expenses among trip participants (Pro & Business)</span>
                  </li>
                </ul>
                <Button className="mt-6" asChild>
                  <Link href="/register">Start Budgeting</Link>
                </Button>
              </div>
              <div className="bg-muted rounded-lg p-6 order-first md:order-last">
                <img
                  src="/images/budget.jpeg?height=400&width=600"
                  alt="Budget tracking interface"
                  className="rounded-md shadow-lg w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mobile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-muted rounded-lg p-6">
                <img
                  src="/images/mobile.jpeg?height=400&width=600"
                  alt="Mobile app interface"
                  className="rounded-md shadow-lg w-full"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Travel With Confidence</h2>
                <p className="text-muted-foreground mb-6">
                  Access your travel plans anytime, anywhere, even without an internet connection. Our mobile-friendly
                  design ensures you're never lost.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Fully responsive design works on any device</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Offline access to all your travel details</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Automatic sync when back online</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Location-based notifications and reminders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Optimized for low data usage when traveling</span>
                  </li>
                </ul>
                <Button className="mt-6" asChild>
                  <Link href="/register">Try It Now</Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 border rounded-lg">
            <Compass className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Destination Guides</h3>
            <p className="text-muted-foreground">
              Access curated information about popular destinations, including local attractions, customs, and travel
              tips.
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg">
            <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Travel Documents</h3>
            <p className="text-muted-foreground">
              Store and organize all your important travel documents in one secure place for easy access when needed.
            </p>
          </div>

          <div className="text-center p-6 border rounded-lg">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Travel Insurance</h3>
            <p className="text-muted-foreground">
              Track your travel insurance details and access policy information quickly in case of emergencies.
            </p>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Planning Your Next Adventure?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who use Travel Itinerary Planner to create unforgettable journeys.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Sign Up Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Is there a free plan available?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer a free plan that includes basic features for individual travelers. You can create up to
                  3 itineraries and invite 1 collaborator per itinerary.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Can I access my itineraries offline?</h3>
                <p className="text-muted-foreground">
                  Yes, our Pro and Business plans include offline access. Your itineraries will be available even
                  without an internet connection, and any changes will sync when you're back online.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">How many people can I invite to collaborate?</h3>
                <p className="text-muted-foreground">
                  The Free plan allows 1 collaborator, the Pro plan allows up to 5 collaborators per itinerary, and the
                  Business plan offers unlimited collaborators.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I export my itinerary to PDF?</h3>
                <p className="text-muted-foreground">
                  Yes, all plans include the ability to export your itinerary to PDF for printing or sharing with
                  others who don't have an account.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">What Our Users Say</h2>
            <div className="space-y-6">
              <div className="bg-card border rounded-lg p-4">
                <p className="italic mb-4">
                  "This app made planning our family vacation so much easier. We could all contribute ideas and see the
                  plan come together in real-time. The budget tracking feature saved us from overspending!"
                </p>
                <p className="font-medium">- Sarah T., Family Traveler</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <p className="italic mb-4">
                  "As a frequent business traveler, I love how this app keeps all my travel details organized. The
                  offline access is a lifesaver when I'm in areas with poor connectivity."
                </p>
                <p className="font-medium">- Michael R., Business Traveler</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <p className="italic mb-4">
                  "Planning a trip with friends used to be chaotic with details scattered across emails and messages.
                  Now we use this app for everything, and everyone stays on the same page!"
                </p>
                <p className="font-medium">- Jamie L., Group Travel Organizer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
