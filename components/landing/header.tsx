"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: t.home, href: "/" },
    { name: t.courses, href: "/courses" },
    { name: t.about, href: "/about" },
    { name: t.contact, href: "/contact" },
  ]

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-950 dark:border-gray-800 h-16">
        <div className="container mx-auto flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-3 w-16 animate-pulse bg-gray-100 dark:bg-gray-900 rounded" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-950/95 dark:border-gray-800 dark:supports-[backdrop-filter]:bg-gray-950/80 transition-all duration-500">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
          <div className="relative h-12 w-12 flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-md group-hover:shadow-lg transition-all border border-blue-100 dark:border-blue-900/30">
            <img
              src="/logo.png"
              alt="EthioGerman Logo"
              className="h-full w-full object-contain p-1"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black leading-none text-blue-700 dark:text-blue-400 tracking-tight">{t.schoolName}</span>
            <span className="text-[10px] text-gray-600 dark:text-gray-400 leading-none mt-1.5 uppercase tracking-widest font-bold">{t.schoolSubtitle}</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-gray-800 dark:text-gray-200 transition-all hover:text-blue-600 dark:hover:text-blue-400 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>

          <div className="hidden md:flex items-center gap-3 ml-2">
            <Button asChild variant="ghost" className="font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Link href="/auth/login">{t.signIn}</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all">
              <Link href="/auth/sign-up">{t.getStarted}</Link>
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-gray-800 dark:text-gray-200">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] dark:bg-gray-950 dark:border-gray-800 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{t.schoolName}</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-2 p-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-bold text-gray-800 dark:text-gray-200 py-3 border-b border-gray-50 dark:border-gray-900 last:border-0 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="mt-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.theme}</span>
                      <ThemeSwitcher />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.language}</span>
                      <LanguageSwitcher />
                    </div>
                    <Button asChild variant="outline" className="w-full mt-4 font-bold border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200">
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>{t.signIn}</Link>
                    </Button>
                    <Button asChild className="w-full font-bold bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                      <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>{t.getStarted}</Link>
                    </Button>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

