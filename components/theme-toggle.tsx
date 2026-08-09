"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => mounted && setTheme(isDark ? "light" : "dark")}
      className={`grid h-10 w-10 place-items-center border border-border bg-transparent text-foreground transition-colors hover:border-foreground ${className}`}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      {!mounted ? (
        <span className="h-4 w-4" aria-hidden="true" />
      ) : isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
