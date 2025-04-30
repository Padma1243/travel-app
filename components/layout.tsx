"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Menu } from 'lucide-react'
import { useSession } from "./session-provider"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { ThemeToggle } from "./theme-toggle"
import { Footer } from "./footer"
import Head from 'next/head'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { session, logout } = useSession()
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background ">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">TravelPlanner</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                router.pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/features"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                router.pathname === "/features" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Features
            </Link>
            {/* <Link
              href="/pricing"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                router.pathname === "/pricing" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Pricing
            </Link> */}
            {/* <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                router.pathname === "/contact" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Contact
            </Link> */}
            <ThemeToggle /> 
            {session ? (
              <>
                <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="outline" onClick={() => logout()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button onClick={() => router.push("/register")}>Sign Up</Button>
              </>
            )}
          </nav>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/features" className="text-sm font-medium transition-colors hover:text-primary">
                  Features
                </Link>
                <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
                  Pricing
                </Link>
                <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                  Contact
                </Link>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                </div>
                {session ? (
                  <>
                    <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                      Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => logout()}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => router.push("/login")}>
                      Login
                    </Button>
                    <Button onClick={() => router.push("/register")}>Sign Up</Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
