"use client"

import Head from "next/head"
import Link from "next/link"
import { Layout } from "@/components/layout"

export default function Terms() {
  return (
    <Layout>
      <Head>
        <title>Terms of Service | Travel Itinerary Planner</title>
      </Head>

      <div className="container px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-sm sm:prose max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: November 15, 2023</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to Travel Itinerary Planner ("we," "our," or "us"). By accessing or using our website, mobile
              application, and services (collectively, the "Services"), you agree to be bound by these Terms of Service
              ("Terms"). Please read these Terms carefully before using our Services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Acceptance of Terms</h2>
            <p>
              By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound
              by these Terms. If you do not agree to these Terms, you may not access or use our Services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of any material changes by
              posting the updated Terms on our website or through other communications. Your continued use of the
              Services after such changes constitutes your acceptance of the new Terms.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. User Accounts</h2>
            <p>
              To use certain features of our Services, you may need to create an account. You are responsible for
              maintaining the confidentiality of your account credentials and for all activities that occur under your
              account. You agree to provide accurate and complete information when creating your account and to update
              your information to keep it accurate and current.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. User Content</h2>
            <p>
              Our Services allow you to create, upload, and share content such as itineraries, reviews, and comments
              ("User Content"). You retain ownership of your User Content, but you grant us a worldwide, non-exclusive,
              royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User
              Content in connection with providing and promoting our Services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use our Services for any illegal purpose or in violation of any laws</li>
              <li>
                Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or
                otherwise objectionable
              </li>
              <li>
                Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or
                entity
              </li>
              <li>Interfere with or disrupt the Services or servers or networks connected to the Services</li>
              <li>Attempt to gain unauthorized access to any part of the Services</li>
              <li>Use any robot, spider, or other automated device to access the Services</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Subscription and Payments</h2>
            <p>
              Some features of our Services require a paid subscription. By subscribing to our paid Services, you agree
              to pay all fees in accordance with the pricing and payment terms presented to you at the time of purchase.
              All payments are non-refundable except as expressly set forth in these Terms or as required by applicable
              law.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to our Services at any time, with or without
              cause, and with or without notice. Upon termination, your right to use the Services will immediately
              cease.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Disclaimer of Warranties</h2>
            <p>
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
              IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">10. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING
              FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without
              regard to its conflict of law provisions.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">12. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p>
              Email: support@travelitineraryplanner.com
              <br />
              Address: 123 Travel Street, Suite 456, Destination City, DC 78901
            </p>
          </div>

          <div className="mt-12 border-t pt-6">
            <p className="text-sm text-muted-foreground">
              By using our Services, you acknowledge that you have read and understood these Terms and agree to be bound
              by them.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="/privacy" className="text-sm text-primary hover:underline">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-sm text-primary hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
