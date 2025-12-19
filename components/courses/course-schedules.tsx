"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Users, User } from "lucide-react"
import { format } from "date-fns"
import { EnrollButton } from "@/components/courses/enroll-button"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

interface Schedule {
  id: string
  start_date: string
  end_date: string
  days_of_week: number[]
  time_start: string
  time_end: string
  available_seats: number
  status: string
  instructor?: {
    full_name: string
    avatar_url?: string
  }
}

export function CourseSchedules({ schedules, courseId }: { schedules: Schedule[]; courseId: string }) {
  const { language } = useLanguage()
  const t = translations[language]

  if (schedules.length === 0) {
    return (
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardContent className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">{t.noSchedulesAvailable}</p>
        </CardContent>
      </Card>
    )
  }

  const getDayName = (day: number) => {
    const days =
      language === "am"
        ? ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"]
        : language === "de"
          ? ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
          : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days[day]
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {schedules.map((schedule, index) => (
        <motion.div
          key={schedule.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="flex flex-col h-full dark:bg-gray-900 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant={schedule.available_seats > 0 ? "default" : "destructive"}
                  className={
                    schedule.available_seats > 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : ""
                  }
                >
                  {schedule.available_seats > 0
                    ? t.seatsLeft.replace("{count}", schedule.available_seats.toString())
                    : t.full}
                </Badge>
                <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                  {schedule.status}
                </Badge>
              </div>
              <CardTitle className="text-lg dark:text-white">{t.scheduleDetails}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center gap-3 text-sm dark:text-gray-300">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>
                  {format(new Date(schedule.start_date), "MMM d, yyyy")} -{" "}
                  {format(new Date(schedule.end_date), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm dark:text-gray-300">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>
                  {schedule.time_start} - {schedule.time_end}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm dark:text-gray-300">
                <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>
                  {t.days}: {schedule.days_of_week.map((d) => getDayName(d)).join(", ")}
                </span>
              </div>
              {schedule.instructor && (
                <div className="flex items-center gap-3 pt-4 border-t dark:border-gray-800">
                  <Avatar className="h-10 w-10 border dark:border-gray-700">
                    <AvatarImage
                      src={schedule.instructor.avatar_url || "/placeholder.svg"}
                      alt={schedule.instructor.full_name}
                    />
                    <AvatarFallback className="dark:bg-gray-800">
                      <User className="h-4 w-4 dark:text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.instructor}
                    </p>
                    <p className="text-sm font-semibold dark:text-white">{schedule.instructor.full_name}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-4">
              <EnrollButton scheduleId={schedule.id} availableSeats={schedule.available_seats} />
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

