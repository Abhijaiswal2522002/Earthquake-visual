"use client"

import { useMemo } from "react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { TimePeriod } from "@/hooks/use-earthquake-data"

interface SidebarProps {
  minMagnitude: number
  setMinMagnitude: (value: number) => void
  autoRefresh: boolean
  setAutoRefresh: (value: boolean) => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  timePeriod: TimePeriod
  setTimePeriod: (value: TimePeriod) => void
  earthquakes: any[]
  lastUpdated: Date | null
  compact?: boolean
}

export default function Sidebar({
  minMagnitude,
  setMinMagnitude,
  autoRefresh,
  setAutoRefresh,
  searchQuery,
  setSearchQuery,
  timePeriod,
  setTimePeriod,
  earthquakes,
  lastUpdated,
  compact = false,
}: SidebarProps) {
  const stats = useMemo(() => {
    const magnitudes = earthquakes.map((eq) => eq.properties.mag)
    return {
      total: earthquakes.length,
      avgMagnitude: magnitudes.length > 0 ? (magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length).toFixed(2) : 0,
      maxMagnitude: magnitudes.length > 0 ? Math.max(...magnitudes).toFixed(2) : 0,
    }
  }, [earthquakes])

  return (
    <div className={`flex flex-col ${compact ? "gap-3" : "gap-6 p-6 h-full overflow-y-auto"}`}>
      {/* Filters */}
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-sm md:text-lg font-semibold text-foreground">Filters</h2>

        <div className="space-y-2">
          <label className="text-xs md:text-sm font-medium text-foreground">Time Period</label>
          <div className="grid grid-cols-3 gap-1.5 md:gap-2">
            {(["hour", "week", "month"] as const).map((period) => (
              <Button
                key={period}
                variant={timePeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimePeriod(period)}
                className="capitalize text-xs md:text-sm py-1.5 md:py-2 h-auto"
              >
                {period === "hour" ? "1h" : period === "week" ? "1w" : "1m"}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs md:text-sm font-medium text-foreground">Search Location</label>
          <Input
            type="text"
            placeholder={compact ? "Search..." : "Search by location..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs md:text-sm py-1.5 md:py-2 h-auto"
            aria-label="Search earthquakes by location"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs md:text-sm font-medium text-foreground">
            Min Magnitude: <span className="font-bold">{minMagnitude.toFixed(1)}</span>
          </label>
          <Slider
            value={[minMagnitude]}
            onValueChange={(value) => setMinMagnitude(value[0])}
            min={0}
            max={9}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs md:text-sm font-medium text-foreground">Auto-refresh</label>
          <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
        </div>
      </div>

      <div className={`space-y-2 pt-3 md:pt-4 ${!compact && "border-t border-border"}`}>
        <h3 className={`text-xs md:text-sm font-semibold text-foreground ${compact ? "hidden" : ""}`}>Statistics</h3>

        {/* Responsive stats layout - 3 column grid on mobile, vertical cards on desktop */}
        {compact ? (
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-2 bg-secondary/20 text-center">
              <p className="text-xs text-muted-foreground truncate">Total</p>
              <p className="text-sm md:text-base font-bold text-primary">{stats.total}</p>
            </Card>
            <Card className="p-2 bg-secondary/20 text-center">
              <p className="text-xs text-muted-foreground truncate">Avg Mag</p>
              <p className="text-sm md:text-base font-bold text-primary">{stats.avgMagnitude}</p>
            </Card>
            <Card className="p-2 bg-secondary/20 text-center">
              <p className="text-xs text-muted-foreground truncate">Max Mag</p>
              <p className="text-sm md:text-base font-bold text-primary">{stats.maxMagnitude}</p>
            </Card>
          </div>
        ) : (
          <div className="space-y-3">
            <Card className="p-3 bg-secondary/20">
              <p className="text-xs text-muted-foreground">Total Earthquakes</p>
              <p className="text-lg md:text-2xl font-bold text-primary">{stats.total}</p>
            </Card>
            <Card className="p-3 bg-secondary/20">
              <p className="text-xs text-muted-foreground">Average Magnitude</p>
              <p className="text-lg md:text-2xl font-bold text-primary">{stats.avgMagnitude}</p>
            </Card>
            <Card className="p-3 bg-secondary/20">
              <p className="text-xs text-muted-foreground">Max Magnitude</p>
              <p className="text-lg md:text-2xl font-bold text-primary">{stats.maxMagnitude}</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
