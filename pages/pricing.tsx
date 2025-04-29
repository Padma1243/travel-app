"use client"

import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Layout } from "@/components/layout"
import { useSession } from "@/components/session-provider"

interface PricingPlan {
  name: string
  description: string
  price: string
  features: string[]
  buttonText: string
  buttonVariant: "default" | "outline" | "secondary"
  popular?: boolean
}

export default function Pricing() {
  const { session } = useSession()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      description: "Basic features for individual travelers",
      price: billingCycle === "monthly" ? "$0" : "$0",
      features: [
        "Create up to 3 itineraries",
        "Basic trip planning tools",
        "Limited collaboration (1 guest)",
        "7-day trip history",
        "Standard support",
      ],
      buttonText: session ? "Current Plan" : "Get Started",
      buttonVariant: "outline",
    },
    {
      name: "Pro",
      description: "Advanced features for frequent travelers",
      price: billingCycle === "monthly" ? "$9.99" : "$99.99",
      features: [
        "Unlimited itineraries",
        "Advanced trip planning tools",
        "Collaboration with up to 5 guests",
        "1-year trip history",
        "Priority support",
        "Offline access",
        "Budget tracking",
      ],
      buttonText: "Upgrade",
      buttonVariant: "default",
      popular: true,
    },
    {
      name: "Business",
      description: "Premium features for travel groups & businesses",
      price: billingCycle === "monthly" ? "$29.99" : "$299.99",
      features: [
        "Everything in Pro",
        "Unlimited collaborators",
        "Team management",
        "Custom branding",
        "API access",
        "Dedicated support",
        "Advanced analytics",
        "Expense reporting",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "secondary",
    },
  ]

  return (
    <Layout>
      <Head>
        <title>Pricing | Travel Itinerary Planner</title>
      </Head>

      <div className="container px-4 md:px-6 py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan for your travel needs. All plans include our core features.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center p-1 border rounded-lg bg-muted/50">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("monthly")}
              className="relative"
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === "yearly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("yearly")}
              className="relative"
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""}`}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "$0" && (
                    <span className="text-muted-foreground ml-2">/{billingCycle === "monthly" ? "month" : "year"}</span>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.buttonVariant} className="w-full" asChild={plan.buttonText !== "Current Plan"}>
                  {plan.buttonText === "Current Plan" ? (
                    <span>{plan.buttonText}</span>
                  ) : (
                    <Link href={plan.buttonText === "Get Started" ? "/register" : "/contact"}>{plan.buttonText}</Link>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div>
              <h3 className="font-medium mb-2">Can I cancel my subscription at any time?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your paid
                features until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, including Visa, Mastercard, and American Express. We also support
                PayPal for payment.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Can I switch between plans?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to
                the new features. When downgrading, the change will take effect at the end of your current billing
                period.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                We offer a 14-day free trial of our Pro plan so you can experience all the features before committing.
                No credit card required for the trial.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center bg-muted/50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Need a custom solution?</h2>
          <p className="text-muted-foreground mb-6">
            Contact our sales team for enterprise solutions tailored to your organization's needs.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </Layout>
  )
}
