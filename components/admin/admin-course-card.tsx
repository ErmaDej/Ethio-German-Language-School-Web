"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Clock, Users, Calendar, Edit3, Eye } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export function AdminCourseCard({ course }: { course: any }) {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-gray-900 dark:border-gray-800">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold dark:text-white">
                {course.title[language] || course.title.en}
              </CardTitle>
              <CardDescription className="line-clamp-2 dark:text-gray-400">
                {course.short_description?.[language] || course.description?.[language] || course.description?.en}
              </CardDescription>
            </div>
            <Badge
              variant={course.is_active ? "default" : "secondary"}
              className={course.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}
            >
              {course.is_active ? t.active || "Active" : t.inactive || "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <Badge variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                {course.level.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{course.duration_weeks} {t.weeks}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4 text-blue-500" />
              <span>{t.maxStudents?.replace("{count}", course.max_students.toString()) || `Max ${course.max_students}`}</span>
            </div>
            <div className="flex flex-row items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
              <DollarSign className="h-4 w-4" />
              <div className="flex flex-col text-xs">
                <span>{course.price_usd.toLocaleString()} ETB/mo</span>
                <span className="text-gray-500 dark:text-gray-400 font-normal">
                  Total: {(course.price_usd * (course.duration_weeks / 4)).toLocaleString()} ETB
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t dark:border-gray-800">
            <Button asChild variant="outline" size="sm" className="gap-2 dark:border-gray-700 dark:text-gray-300">
              <Link href={`/admin/courses/${course.id}/edit`}>
                <Edit3 className="h-4 w-4" />
                {t.edit || "Edit"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2 dark:border-gray-700 dark:text-gray-300">
              <Link href={`/admin/courses/${course.id}/schedules`}>
                <Calendar className="h-4 w-4" />
                {t.viewSchedules || "Schedules"}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="gap-2 hover:text-blue-600 dark:hover:text-blue-400 ml-auto">
              <Link href={`/courses/${course.id}`}>
                <Eye className="h-4 w-4" />
                {t.preview || "Preview"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div >
  )
}
