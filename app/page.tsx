"use client"

import { useState } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import EarthquakeMap from "@/components/earthquake-map"
import DetailsPanel from "@/components/details-panel"
import { useEarthquakeData, type TimePeriod } from "@/hooks/use-earthquake-data"

export default function Home() {
  const [selectedEarthquake, setSelectedEarthquake] = useState(null)
  const [minMagnitude, setMinMagnitude] = useState(0)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month")
  const { earthquakes, lastUpdated, loading } = useEarthquakeData(autoRefresh, timePeriod)

  const filteredEarthquakes = earthquakes.filter((eq) => {
    const matchesMagnitude = eq.properties.mag >= minMagnitude
    const matchesSearch = searchQuery === "" || eq.properties.place.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesMagnitude && matchesSearch
  })

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col md:border-r md:border-border">
        <Sidebar
          minMagnitude={minMagnitude}
          setMinMagnitude={setMinMagnitude}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
          earthquakes={filteredEarthquakes}
          lastUpdated={lastUpdated}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen md:min-h-0">
        <Header lastUpdated={lastUpdated} />
        <div className="flex-1 relative pb-56 md:pb-0">
          <EarthquakeMap
            earthquakes={filteredEarthquakes}
            selectedEarthquake={selectedEarthquake}
            onSelectEarthquake={(eq) => {
              setSelectedEarthquake(eq)
              setShowDetails(true)
            }}
          />
        </div>
      </div>

      {/* Mobile Bottom Sheet & Desktop Details Panel */}
      {selectedEarthquake && (
        <DetailsPanel
          earthquake={selectedEarthquake}
          onClose={() => {
            setSelectedEarthquake(null)
            setShowDetails(false)
          }}
        />
      )}

      {/* Mobile Filter Sheet with Statistics */}
      {showDetails === false && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 rounded-t-lg shadow-lg z-40 max-h-[55vh] overflow-y-auto">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-1 bg-muted rounded-full" />
          </div>
          <Sidebar
            minMagnitude={minMagnitude}
            setMinMagnitude={setMinMagnitude}
            autoRefresh={autoRefresh}
            setAutoRefresh={setAutoRefresh}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
            earthquakes={filteredEarthquakes}
            lastUpdated={lastUpdated}
            compact
          />
        </div>
      )}
    </div>
  )
}
