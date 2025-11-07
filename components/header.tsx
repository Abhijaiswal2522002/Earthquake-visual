"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

interface HeaderProps {
  lastUpdated: Date | null
}

export default function Header({ lastUpdated }: HeaderProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    html.classList.toggle("dark")
    setIsDark(!isDark)
  }

  const formatTime = (date: Date | null) => {
    if (!date) return "Loading..."
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <header className="border-b border-border bg-card px-4 md:px-6 py-2 md:py-4 flex items-center justify-between flex-wrap gap-2">
      <div className="min-w-0">
        <h1 className="text-lg md:text-2xl font-bold text-primary truncate">Earthquake Visualizer</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Updated: {formatTime(lastUpdated)}</p>
      </div>
      <button
        onClick={toggleTheme}
        className="p-1.5 md:p-2 rounded-lg hover:bg-secondary transition-colors flex-shrink-0"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
      </button>
    </header>
  )
}
