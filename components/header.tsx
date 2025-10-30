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
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  return (
    <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-primary">Earthquake Visualizer</h1>
        <p className="text-sm text-muted-foreground">Last updated: {formatTime(lastUpdated)}</p>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  )
}
