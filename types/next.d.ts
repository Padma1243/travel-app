// src/types/next.d.ts
import { NextApiRequest } from 'next'

declare module 'next' {
  interface NextApiRequest {
    user: {
      id: string
      name?: string
      email?: string
      avatarUrl?: string|null
    }
  }
}
