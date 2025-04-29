"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t  py-12 bg-background ">
      <div className="container  px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">TravelPlanner</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Plan your perfect trip with our comprehensive travel itinerary planner. Create, collaborate, and travel with confidence.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="https://www.facebook.com/" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://x.com/" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://www.instagram.com/" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://in.linkedin.com/" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
                </li>
                <li>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              
              </li>
              {/* <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li> */}
              
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              
             
            </ul>
          </div>
        </div>
        <div className=" mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} TravelPlanner. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="mailto:support@travelplanner.com" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-4 w-4 mr-2" />
              support@travelplanner.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
