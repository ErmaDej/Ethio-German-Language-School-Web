"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export function EnrollmentCard({ enrollment }: { enrollment: any }) {
  const { language } = useLanguage()
  const t = translations[language]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold dark:text-white">
                {enrollment.schedule.course.title[language] || enrollment.schedule.course.title.en}
              </CardTitle>
              <CardDescription className="mt-1 dark:text-gray-400">
                {enrollment.schedule.course.description?.[language] || enrollment.schedule.course.description?.en}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatusColor(enrollment.enrollment_status)}>
                {t[enrollment.enrollment_status as keyof typeof t] || enrollment.enrollment_status}
              </Badge>
              <Badge variant="outline" className="dark:text-gray-400 dark:border-gray-700">
                {t[enrollment.payment_status as keyof typeof t] || enrollment.payment_status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">{t.progress}</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{enrollment.progress_percentage}%</span>
            </div>
            <Progress value={enrollment.progress_percentage || 0} className="h-2" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="dark:text-gray-300">
                {format(new Date(enrollment.schedule.start_date), "MMM d")} -{" "}
                {format(new Date(enrollment.schedule.end_date), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="dark:text-gray-300">
                {enrollment.schedule.time_start.slice(0, 5)} - {enrollment.schedule.time_end.slice(0, 5)}
              </span>
            </div>
          </div>

          {enrollment.schedule.instructor && (
            <div className="flex items-center gap-4 pt-4 border-t dark:border-gray-800">
              <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-700">
                <AvatarImage
                  src={enrollment.schedule.instructor.avatar_url || "/placeholder.svg"}
                  alt={enrollment.schedule.instructor.full_name}
                />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.instructor}</p>
                <p className="text-sm font-bold dark:text-white">{enrollment.schedule.instructor.full_name}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
