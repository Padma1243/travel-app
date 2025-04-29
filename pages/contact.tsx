"use client"

import { useState } from "react"
import Head from "next/head"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MapPin, Phone, MessageSquare, CheckCircle } from "lucide-react"

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  reason: z.string().min(1, { message: "Please select a reason for contact" }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      reason: "",
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // In a real app, you would send this data to your backend
      console.log("Form data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      reset()
    } catch (err) {
      setError("An error occurred while submitting the form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Contact Us | Travel Itinerary Planner</title>
      </Head>

      <div className="container px-4 md:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Contact Us</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Our team is here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <p className="text-sm text-muted-foreground mt-1">For general inquiries</p>
                      <a
                        href="mailto:info@travelitineraryplanner.com"
                        className="text-sm text-primary hover:underline mt-1 block"
                      >
                        info@travelitineraryplanner.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="text-sm text-muted-foreground mt-1">Monday-Friday, 9am-5pm EST</p>
                      <a href="tel:+1-555-123-4567" className="text-sm text-primary hover:underline mt-1 block">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Visit Us</h3>
                      <p className="text-sm text-muted-foreground mt-1">Our headquarters</p>
                      <address className="text-sm not-italic mt-1">
                        123 Travel Street
                        <br />
                        Suite 456
                        <br />
                        Destination City, DC 78901
                      </address>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MessageSquare className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Live Chat</h3>
                      <p className="text-sm text-muted-foreground mt-1">Chat with our support team</p>
                      <p className="text-sm mt-1">Available 24/7 for Pro and Business plans</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-primary/10 p-3 mb-4">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. We've received your message and will respond shortly.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input id="name" placeholder="John Doe" {...register("name")} />
                          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
                          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Contact</Label>
                        <Select onValueChange={(value) => setValue("reason", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing Question</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="How can we help you?" {...register("subject")} />
                        {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Please provide details about your inquiry..."
                          rows={5}
                          {...register("message")}
                        />
                        {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
                      </div>
                    </form>
                  )}
                </CardContent>
                {!isSubmitted && (
                  <CardFooter>
                    <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do I reset my password?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You can reset your password by clicking on the "Forgot Password" link on the login page. You'll
                    receive an email with instructions to create a new password.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I use the app offline?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, our Pro and Business plans include offline access. You can view and edit your itineraries even
                    without an internet connection, and changes will sync when you're back online.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do I share my itinerary with others?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Open your itinerary and click the "Share" button. You can invite collaborators by email or generate
                    a shareable link that you can send to anyone.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Business
                    plans, we also offer invoice payment options.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
