"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Clock, TrendingUp, Globe, MapPin, User } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

interface Course {
  id: string
  title: any
  description: any
  short_description: any
  level: string
  language_taught: string
  duration_weeks: number
  hours_per_week: number
  price_usd: number
  delivery_method: string
  thumbnail_url?: string
}

export function CourseGrid({ courses }: { courses: Course[] }) {
  const { language } = useLanguage()
  const t = translations[language]

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{t.noCoursesFoundMatching}</p>
      </div>
    )
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
      case "a1":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "elementary":
      case "a2":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "intermediate":
      case "b1":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      case "upper_intermediate":
      case "b2":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "advanced":
      case "c1":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "proficient":
      case "c2":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case "online":
        return <Globe className="h-4 w-4" />
      case "onsite":
        return <MapPin className="h-4 w-4" />
      case "one_to_one":
        return <User className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getDeliveryLabel = (method: string) => {
    switch (method) {
      case "online":
        return t.onlineClass
      case "onsite":
        return t.onsiteClass
      case "one_to_one":
        return t.oneToOne
      default:
        return method
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800 group">
            <CardHeader className="pb-4">
              <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-4">
                <div className="h-full w-1/3 bg-gradient-to-r from-blue-600 to-blue-400" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <Badge className={`${getLevelColor(course.level)} border-none`}>{course.level}</Badge>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${course.price_usd}</span>
              </div>
              <CardTitle className="text-xl dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {course.title[language] || course.title.en}
              </CardTitle>
              <CardDescription className="text-base dark:text-gray-400 line-clamp-2">
                {course.short_description?.[language] || course.short_description?.en || course.description[language] || course.description.en}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  {getDeliveryIcon(course.delivery_method)}
                  <span>{getDeliveryLabel(course.delivery_method)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration_weeks} {t.weeks}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>{course.hours_per_week} {t.hoursPerWeek}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                <Link href={`/courses/${course.id}`}>{t.viewDetails}</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

