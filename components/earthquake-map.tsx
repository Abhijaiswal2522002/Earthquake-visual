"use client"

import { useEffect, useRef, useState } from "react"

interface EarthquakeMapProps {
  earthquakes: any[]
  selectedEarthquake: any
  onSelectEarthquake: (earthquake: any) => void
}

const getMagnitudeColor = (magnitude: number | null): string => {
  if (!magnitude) return "#9ca3af" // gray for unknown
  if (magnitude >= 6.0) return "#dc2626" // red
  if (magnitude >= 4.0) return "#ea580c" // orange
  return "#16a34a" // green
}

const getMagnitudeRadius = (magnitude: number | null): number => {
  if (!magnitude) return 8
  return Math.max(5, Math.min(25, magnitude * 2.5))
}

function EarthquakeMapContent({ earthquakes, selectedEarthquake, onSelectEarthquake }: EarthquakeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !mapContainer.current) return

    const initializeMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet.markercluster")

      // Initialize map
      if (!map.current) {
        map.current = L.map(mapContainer.current).setView([20, 0], 2)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map.current)
      }

      // Clear existing markers
      markersRef.current.forEach((marker: any) => map.current?.removeLayer(marker))
      markersRef.current = []

      // Add earthquake markers
      earthquakes.forEach((earthquake: any) => {
        const { geometry, properties } = earthquake
        const [lng, lat] = geometry.coordinates
        const magnitude = properties.mag ?? null
        const depth = geometry.coordinates[2] ?? null
        const place = properties.place || "Unknown Location"
        const time = new Date(properties.time)

        const marker = L.circleMarker([lat, lng], {
          radius: getMagnitudeRadius(magnitude),
          fillColor: getMagnitudeColor(magnitude),
          color: getMagnitudeColor(magnitude),
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.7,
        })

        const magnitudeText = magnitude !== null ? magnitude.toFixed(2) : "N/A"
        const depthText = depth !== null ? depth.toFixed(1) : "N/A"

        marker.bindPopup(`
          <div class="p-2">
            <p class="font-semibold">${place}</p>
            <p class="text-sm">Magnitude: ${magnitudeText}</p>
            <p class="text-sm">Depth: ${depthText} km</p>
            <p class="text-sm">${time.toLocaleString()}</p>
          </div>
        `)

        marker.on("click", () => {
          onSelectEarthquake(earthquake)
        })

        marker.addTo(map.current!)
        markersRef.current.push(marker)
      })

      // Highlight selected earthquake
      if (selectedEarthquake) {
        const { geometry } = selectedEarthquake
        const [lng, lat] = geometry.coordinates
        map.current.setView([lat, lng], 6)
      }
    }

    initializeMap()
  }, [isClient, earthquakes, selectedEarthquake, onSelectEarthquake])

  return <div ref={mapContainer} className="w-full h-full" />
}

export default function EarthquakeMap(props: EarthquakeMapProps) {
  return <EarthquakeMapContent {...props} />
}
