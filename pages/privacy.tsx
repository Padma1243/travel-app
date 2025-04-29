"use client"

import Head from "next/head"
import Link from "next/link"
import { Layout } from "@/components/layout"

export default function Privacy() {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy | Travel Itinerary Planner</title>
      </Head>

      <div className="container px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-sm sm:prose max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: November 15, 2023</p>

            <p className="mb-6">
              This Privacy Policy describes how Travel Itinerary Planner ("we," "our," or "us") collects, uses, and
              shares your personal information when you use our website, mobile application, and services (collectively,
              the "Services").
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>

            <h3 className="text-lg font-medium mt-6 mb-3">1.1 Information You Provide to Us</h3>
            <p>We collect information you provide directly to us when you:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Create an account or user profile</li>
              <li>Create and manage travel itineraries</li>
              <li>Communicate with other users</li>
              <li>Contact our customer support</li>
              <li>Subscribe to our newsletters or marketing communications</li>
              <li>Participate in surveys, contests, or promotions</li>
            </ul>
            <p>
              This information may include your name, email address, password, profile picture, travel preferences, and
              any other information you choose to provide.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-3">1.2 Information We Collect Automatically</h3>
            <p>When you use our Services, we automatically collect certain information, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Device information (such as your IP address, browser type, operating system)</li>
              <li>Usage information (such as pages visited, features used, actions taken)</li>
              <li>Location information (if you grant us permission)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process transactions and manage your account</li>
              <li>Send you technical notices, updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Communicate with you about products, services, offers, and events</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Personalize your experience and deliver content relevant to your interests</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Sharing of Information</h2>
            <p>We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>With other users when you choose to share your itineraries or collaborate</li>
              <li>
                With vendors, service providers, and consultants who need access to such information to perform services
                for us
              </li>
              <li>
                In response to a request for information if we believe disclosure is in accordance with applicable law
              </li>
              <li>If we believe your actions are inconsistent with our user agreements or policies</li>
              <li>
                In connection with, or during negotiations of, any merger, sale of company assets, financing, or
                acquisition
              </li>
              <li>With your consent or at your direction</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Your Choices</h2>
            <p>You have several choices regarding your information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Account Information:</strong> You can update your account information through your account
                settings.
              </li>
              <li>
                <strong>Marketing Communications:</strong> You can opt out of receiving promotional emails by following
                the instructions in those emails.
              </li>
              <li>
                <strong>Cookies:</strong> Most web browsers are set to accept cookies by default. You can usually choose
                to set your browser to remove or reject cookies.
              </li>
              <li>
                <strong>Location Information:</strong> You can prevent us from collecting location information by
                changing the settings on your device.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Retention</h2>
            <p>
              We store the information we collect about you for as long as is necessary for the purposes for which we
              originally collected it, or for other legitimate business purposes, including to meet our legal,
              regulatory, or other compliance obligations.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized
              access, disclosure, alteration, and destruction.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
            <p>
              Our Services are not directed to children under 13, and we do not knowingly collect personal information
              from children under 13. If we learn we have collected personal information from a child under 13, we will
              delete that information.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. International Data Transfers</h2>
            <p>
              We may transfer your information to countries other than the country in which you are located. These
              countries may have data protection laws that are different from the laws of your country.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising
              the date at the top of the policy and, in some cases, we may provide you with additional notice.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>
              Email: privacy@travelitineraryplanner.com
              <br />
              Address: 123 Travel Street, Suite 456, Destination City, DC 78901
            </p>
          </div>

          <div className="mt-12 border-t pt-6">
            <p className="text-sm text-muted-foreground">
              By using our Services, you acknowledge that you have read and understood this Privacy Policy.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="/terms" className="text-sm text-primary hover:underline">
                Terms of Service
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
