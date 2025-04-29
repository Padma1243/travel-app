"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Calendar, CreditCard, Home, LogOut, Map, Menu, Settings, User, X } from "lucide-react"
import { useSession } from "./session-provider"
import { Button } from "./ui/button"
import { Sheet, SheetContent } from "./ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ThemeToggle } from "./theme-toggle"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, logout } = useSession({ required: true })
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Add null check for session and user
  const userInitials = session?.user?.name 
    ? session.user.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
    : '?'

  if (!session?.user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Itineraries", href: "/dashboard/itineraries", icon: Map },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "Budget", href: "/dashboard/budget", icon: CreditCard },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return router.pathname === "/dashboard"
    }
    return router.pathname.startsWith(path)
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-background">
        <div className="p-6">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">TravelPlanner</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={session.user?.avatarUrl || ""} alt={session.user.name} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <Button variant="ghost" className="w-full mt-4 justify-start" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold">TravelPlanner</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={session.user?.avatarUrl || ""} alt={session.user.name} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 justify-start"
              onClick={() => {
                setIsSidebarOpen(false)
                logout()
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-background flex items-center px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
