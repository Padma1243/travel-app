"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/router"

interface User {
  id: number
  name: string
  email: string
  avatarUrl?: string
}

interface SessionContextType {
  session: { user: User; token: string } | null
  loading: boolean
  login: (user: User, token: string) => Promise<void>
  logout: () => Promise<void>
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
})

export function useSession({ required = false } = {}) {
  const context = useContext(SessionContext)
  const router = useRouter()

  useEffect(() => {
    if (required && !context.loading && !context.session) {
      router.push(`/login?returnUrl=${encodeURIComponent(router.asPath)}`)
    }
  }, [required, context.loading, context.session, router])

  return context
}

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<{ user: User; token: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserFromSession() {
      try {
        const storedToken = localStorage.getItem('auth_token')
        
        if (!storedToken) {
          setLoading(false)
          return
        }
    
        const res = await fetch("/api/auth/me", {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (res.ok) {
          const data = await res.json()
          setSession({ user: data.user, token: storedToken })
        } else {
          // Clear invalid token
          localStorage.removeItem('auth_token')
          setSession(null)
        }
      } catch (error) {
        console.error("Failed to load user session:", error)
        localStorage.removeItem('auth_token')
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    loadUserFromSession()
  }, [])

  const login = async (user: User, token: string) => {
    // Save token to local storage
    localStorage.setItem('auth_token', token)
    setSession({ user, token })
    
    const returnUrl = router.query.returnUrl as string
    if (returnUrl) {
      router.push(returnUrl)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      // Clear token from local storage
      localStorage.removeItem('auth_token')
      setSession(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return <SessionContext.Provider value={{ session, loading, login, logout }}>{children}</SessionContext.Provider>
}
