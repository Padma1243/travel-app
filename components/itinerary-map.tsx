"use client"

import { useEffect, useRef } from "react"
import dynamic from 'next/dynamic'
import type { LatLngExpression } from 'leaflet'

export interface ItineraryMapProps {
  destinations: Array<{
    id: string
    name: string
    location: string
    coordinates?: {
      lat: number
      lng: number
    }
  }>
}

const MapComponent = dynamic(() => import('./map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse" />
})

const ItineraryMap: React.FC<ItineraryMapProps> = ({ destinations }) => {
  // Calculate center based on first destination with coordinates or use default
  const center = destinations.find(d => d.coordinates)?.coordinates || { lat: 48.8566, lng: 2.3522 }

  return (
    <div className="h-[400px] rounded-lg overflow-hidden">
      <MapComponent
        center={[center.lat, center.lng]}
        zoom={13}
        markers={destinations.map(dest => ({
          id: dest.id,
          position: dest.coordinates ? [dest.coordinates.lat, dest.coordinates.lng] : [0, 0],
          popup: dest.name
        }))}
      />
    </div>
  )
}

export default ItineraryMap
