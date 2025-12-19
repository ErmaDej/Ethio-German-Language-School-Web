"use client"

import { Button } from "@/components/ui/button"
import { useLanguage, type Language } from "@/lib/hooks/use-language"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

const languages = [
  {
    code: "en" as Language,
    name: "English",
    flag: "🇬🇧", // UK flag instead of US
    svgFlag: (
      <svg className="h-5 w-5 rounded-sm" viewBox="0 0 60 30">
        <clipPath id="s">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id="t">
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <g clipPath="url(#s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
      </svg>
    ),
  },
  {
    code: "de" as Language,
    name: "Deutsch",
    flag: "🇩🇪",
    svgFlag: (
      <svg className="h-5 w-5 rounded-sm" viewBox="0 0 5 3">
        <rect width="5" height="3" fill="#000" />
        <rect width="5" height="2" y="1" fill="#D00" />
        <rect width="5" height="1" y="2" fill="#FFCE00" />
      </svg>
    ),
  },
  {
    code: "am" as Language,
    name: "አማርኛ",
    flag: "🇪🇹",
    svgFlag: (
      <svg className="h-5 w-5 rounded-sm" viewBox="0 0 6 3">
        <rect width="6" height="3" fill="#078930" />
        <rect width="6" height="2" y="1" fill="#FCDD09" />
        <rect width="6" height="1" y="2" fill="#DA121A" />
        <circle cx="3" cy="1.5" r="0.8" fill="#0F47AF" />
        <path d="M3,0.8 L3.3,1.4 L3,1.9 L2.7,1.4 Z" fill="#FCDD09" />
      </svg>
    ),
  },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentLang = languages.find((l) => l.code === language)

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="gap-2 w-9 h-9 p-0 sm:w-auto sm:px-3">
        <div className="h-5 w-5 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-sm" />
        <span className="hidden sm:inline-block h-4 w-16 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 focus-visible:ring-blue-500 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800">
          {currentLang?.svgFlag}
          <span className="hidden sm:inline font-medium">{currentLang?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px] dark:bg-gray-900 dark:border-gray-800">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`gap-3 cursor-pointer transition-colors ${language === lang.code
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold"
              : "dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
          >
            {lang.svgFlag}
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
