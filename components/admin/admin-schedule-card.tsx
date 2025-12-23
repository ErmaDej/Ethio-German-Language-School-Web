"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Users, Edit3, ListChecks } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export function AdminScheduleCard({ schedule }: { schedule: any }) {
  const { language } = useLanguage()
  const t = translations[language]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "upcoming":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "completed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getDayName = (day: number) => {
    const daysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const daysAm = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"]
    return language === "am" ? daysAm[day] : daysEn[day]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold dark:text-white">
                {schedule.course.title[language] || schedule.course.title.en}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4 text-blue-500" />
                <span>{schedule.instructor?.full_name || t.unassigned}</span>
              </div>
            </div>
            <Badge className={getStatusColor(schedule.status)}>
              {t[schedule.status as keyof typeof t] || schedule.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                {format(new Date(schedule.start_date), "MMM d")} - {format(new Date(schedule.end_date), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                {schedule.time_start.slice(0, 5)} - {schedule.time_end.slice(0, 5)}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                {schedule.available_seats} {t.availableSeats}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">{t.daysOfWeek}:</span>
            <div className="flex gap-1 flex-wrap">
              {schedule.days_of_week.map((d: number) => (
                <Badge key={d} variant="outline" className="bg-white dark:bg-gray-800">
                  {getDayName(d)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t dark:border-gray-800">
            <Button asChild variant="outline" size="sm" className="gap-2 dark:border-gray-700 dark:text-gray-300">
              <Link href={`/admin/schedules/${schedule.id}/edit`}>
                <Edit3 className="h-4 w-4" />
                {t.edit}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2 dark:border-gray-700 dark:text-gray-300">
              <Link href={`/admin/schedules/${schedule.id}/enrollments`}>
                <ListChecks className="h-4 w-4" />
                {t.recentEnrollments || "Enrollments"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
