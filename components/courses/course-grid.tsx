"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Clock, TrendingUp, Globe, MapPin, User } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"
import { getLevelColor, getLevelLabel } from "@/lib/utils"

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

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case "online":
        return <Globe className="h-4 w-4" />
      case "onsite":
        return <MapPin className="h-4 w-4" />
      case "one_to_one":
      case "one-to-one":
        return <User className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 dark:bg-gray-900 dark:border-gray-800 overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.thumbnail_url || `https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=2070&auto=format&fit=crop`}
                alt={course.title[language] || course.title.en}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className={getLevelColor(course.level)}>
                  {getLevelLabel(course.level, t)}
                </Badge>
              </div>
              <div className="absolute bottom-4 right-4">
                <Badge variant="secondary" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                  {course.language_taught === "de" ? t.german : t.amharic}
                </Badge>
              </div>
            </div>

            <CardHeader className="flex-1">
              <CardTitle className="line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {course.title[language] || course.title.en}
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-2">
                {course.short_description?.[language] || course.description?.[language] || course.description?.en}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{course.duration_weeks} {t.weeks}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span>{course.hours_per_week} {t.hoursPerWeek}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                {getDeliveryIcon(course.delivery_method)}
                <span className="capitalize">{course.delivery_method.replace("_", " ")}</span>
              </div>
            </CardContent>

            <CardFooter className="pt-0 flex items-center justify-between border-t dark:border-gray-800 mt-4">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {course.price_usd.toLocaleString()} ETB
                </span>
                <span className="text-xs text-gray-500 font-normal">
                  / {t.month || "Month"}
                </span>
              </div>
              <Button asChild variant="outline" className="group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Link href={`/courses/${course.id}`}>
                  {t.viewDetails}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
