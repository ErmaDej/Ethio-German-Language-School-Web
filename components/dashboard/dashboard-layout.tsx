"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LogoutButton } from "@/components/auth/logout-button"
import { Menu, LayoutDashboard, BookOpen, FileText, User, Users, Calendar, Settings, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"

export function DashboardLayout({ children, role }: { children: React.ReactNode; role: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { language } = useLanguage()
  const t = translations[language]

  const studentNavigation = [
    { name: t.dashboard, href: "/student", icon: LayoutDashboard },
    { name: t.myCourses, href: "/student/enrollments", icon: BookOpen },
    { name: t.assignments, href: "/student/assignments", icon: FileText },
    { name: t.profile, href: "/student/profile", icon: User },
  ]

  const instructorNavigation = [
    { name: t.dashboard, href: "/instructor", icon: LayoutDashboard },
    { name: t.myCourses, href: "/instructor/courses", icon: BookOpen },
    { name: t.students, href: "/instructor/students", icon: Users },
    { name: t.assignments, href: "/instructor/assignments", icon: FileText },
    { name: t.schedule, href: "/instructor/schedule", icon: Calendar },
  ]

  const adminNavigation = [
    { name: t.dashboard, href: "/admin", icon: LayoutDashboard },
    { name: t.courses, href: "/admin/courses", icon: GraduationCap },
    { name: t.users, href: "/admin/users", icon: Users },
    { name: t.schedule, href: "/admin/schedules", icon: Calendar },
    { name: t.settings, href: "/admin/settings", icon: Settings },
  ]

  const navigation =
    role === "student" ? studentNavigation : role === "instructor" ? instructorNavigation : adminNavigation

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-gray-900 border-r dark:border-gray-800">
        <div className="flex h-16 items-center gap-2 px-6 border-b dark:border-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold">
            EG
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none text-blue-600 dark:text-blue-400">{t.schoolName}</span>
            <span className="text-[10px] text-muted-foreground leading-none capitalize mt-1 tracking-wider font-medium">{role} {t.portal}</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200",
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-500")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="border-t dark:border-gray-800 p-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b dark:border-gray-800 bg-white dark:bg-gray-900 px-4">
        <Link href={`/${role}`} className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold">
            EG
          </div>
          <span className="font-bold text-blue-600 dark:text-blue-400">{t.schoolName}</span>
        </Link>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="dark:text-gray-400">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-0 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex h-16 items-center gap-2 px-6 border-b dark:border-gray-800">
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none text-blue-600 dark:text-blue-400">{t.schoolName}</span>
                <span className="text-xs text-muted-foreground leading-none capitalize mt-1">{role} {t.portal}</span>
              </div>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="border-t dark:border-gray-800 p-4">
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <div className="pt-16 lg:pt-0">
          <div className="p-6 lg:p-8">{children}</div>
        </div>
      </main>
    </div>
  )
}

