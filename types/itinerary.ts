export interface Itinerary {
  id: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  isPublic: boolean
  ownerId?: string
  destinations: { city: string; country: string }[]
  collaborators: { user: { name: string } }[]
}