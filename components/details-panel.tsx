"use client"

import { X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DetailsPanelProps {
  earthquake: any
  onClose: () => void
}

export default function DetailsPanel({ earthquake, onClose }: DetailsPanelProps) {
  const { geometry, properties } = earthquake
  const [lng, lat, depth] = geometry.coordinates
  const { mag, place, time, url } = properties

  const timeObj = new Date(time)

  return (
    <>
      {/* Mobile Bottom Sheet */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-2xl shadow-2xl z-50 max-h-[75vh] overflow-y-auto">
        <div className="p-3 md:p-4 flex items-center justify-between border-b border-border sticky top-0 bg-card rounded-t-2xl">
          <h2 className="text-base md:text-lg font-semibold truncate">Earthquake Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg flex-shrink-0" aria-label="Close">
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        <div className="p-3 md:p-4 space-y-3">
          <DetailContent earthquake={earthquake} />
        </div>
      </div>

      {/* Desktop Side Panel */}
      <div className="hidden md:flex md:w-96 md:flex-col md:border-l md:border-border md:bg-card md:shadow-lg">
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h2 className="text-lg font-semibold">Earthquake Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <DetailContent earthquake={earthquake} />
        </div>
      </div>
    </>
  )
}

function DetailContent({ earthquake }: { earthquake: any }) {
  const { geometry, properties } = earthquake
  const [lng, lat, depth] = geometry.coordinates
  const { mag, place, time, url } = properties
  const timeObj = new Date(time)

  return (
    <>
      <Card className="p-3 md:p-4 bg-secondary/20">
        <p className="text-xs text-muted-foreground mb-1">Location</p>
        <p className="font-semibold text-xs md:text-sm text-foreground line-clamp-2">{place}</p>
      </Card>

      <Card className="p-3 md:p-4 bg-secondary/20">
        <p className="text-xs text-muted-foreground mb-1">Magnitude</p>
        <p className="text-2xl md:text-3xl font-bold text-primary">{mag?.toFixed(2) ?? "N/A"}</p>
      </Card>

      <Card className="p-3 md:p-4 bg-secondary/20">
        <p className="text-xs text-muted-foreground mb-1">Depth</p>
        <p className="text-base md:text-lg font-semibold text-foreground">{depth?.toFixed(1) ?? "N/A"} km</p>
      </Card>

      <Card className="p-3 md:p-4 bg-secondary/20">
        <p className="text-xs text-muted-foreground mb-1">Coordinates</p>
        <p className="text-xs md:text-sm font-mono text-foreground break-all">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
      </Card>

      <Card className="p-3 md:p-4 bg-secondary/20">
        <p className="text-xs text-muted-foreground mb-1">Time (UTC)</p>
        <p className="text-xs md:text-sm text-foreground">{timeObj.toLocaleString()}</p>
      </Card>

      <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm py-1.5 md:py-2 h-auto">
          View on USGS
        </Button>
      </a>
    </>
  )
}
