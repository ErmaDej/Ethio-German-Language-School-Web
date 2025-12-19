"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="gap-2 w-9 h-9 p-0">
        <div className="h-5 w-5 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 relative overflow-hidden group"
        >
          <div className="relative w-5 h-5">
            <Sun className="h-5 w-5 absolute inset-0 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="h-5 w-5 absolute inset-0 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          </div>
          <span className="hidden sm:inline text-sm">
            {resolvedTheme === "dark" ? "Dark" : "Light"}
          </span>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`gap-2 cursor-pointer ${theme === "light" ? "bg-blue-50 dark:bg-blue-950 font-medium" : ""}`}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`gap-2 cursor-pointer ${theme === "dark" ? "bg-blue-50 dark:bg-blue-950 font-medium" : ""}`}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`gap-2 cursor-pointer ${theme === "system" ? "bg-blue-50 dark:bg-blue-950 font-medium" : ""}`}
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
