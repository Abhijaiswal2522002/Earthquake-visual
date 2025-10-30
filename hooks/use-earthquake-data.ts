"use client"

import { useState, useEffect, useCallback } from "react"

interface EarthquakeFeature {
  type: string
  properties: {
    mag: number
    place: string
    time: number
    url: string
  }
  geometry: {
    type: string
    coordinates: [number, number, number]
  }
}

export type TimePeriod = "hour" | "week" | "month"

export function useEarthquakeData(autoRefresh: boolean, timePeriod: TimePeriod = "month") {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  const getApiUrl = useCallback((period: TimePeriod) => {
    const baseUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary"
    switch (period) {
      case "hour":
        return `${baseUrl}/all_hour.geojson`
      case "week":
        return `${baseUrl}/all_week.geojson`
      case "month":
        return `${baseUrl}/all_month.geojson`
      default:
        return `${baseUrl}/all_month.geojson`
    }
  }, [])

  const fetchEarthquakes = useCallback(async () => {
    try {
      setLoading(true)
      const url = getApiUrl(timePeriod)
      const response = await fetch(url)
      const data = await response.json()
      setEarthquakes(data.features || [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch earthquake data:", error)
    } finally {
      setLoading(false)
    }
  }, [timePeriod, getApiUrl])

  useEffect(() => {
    fetchEarthquakes()

    if (!autoRefresh) return

    const interval = setInterval(fetchEarthquakes, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [autoRefresh, fetchEarthquakes])

  return { earthquakes, lastUpdated, loading }
}
