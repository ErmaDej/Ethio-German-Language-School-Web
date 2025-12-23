"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Clock, DollarSign, Globe, TrendingUp, Users } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"
import { getLevelColor, getLevelLabel } from "@/lib/utils"

interface CourseDetailsProps {
  course: {
    title: any
    description: any
    level: string
    language_taught: string
    duration_weeks: number
    hours_per_week: number
    price_usd: number
    max_students: number
  }
}

export function CourseDetails({ course }: CourseDetailsProps) {
  const { language } = useLanguage()
  const t = translations[language]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Badge className={getLevelColor(course.level)}>{getLevelLabel(course.level, t)}</Badge>
          <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
            {course.language_taught === "de" ? t.german : t.amharic}
          </Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          {course.title[language] || course.title.en}
        </h1>
        <div className="prose prose-blue dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
            {course.description[language] || course.description.en}
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div variants={item}>
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t.durationLabel}</p>
                  <p className="text-lg font-semibold dark:text-white">
                    {course.duration_weeks} {t.weeks}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t.timeCommitment}</p>
                  <p className="text-lg font-semibold dark:text-white">
                    {course.hours_per_week} {t.hoursPerWeek}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t.priceMonthly || "Price / Month"}</p>
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold dark:text-white">{course.price_usd.toLocaleString()} ETB</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.priceTotal || "Total"}: {(course.price_usd * (course.duration_weeks / 4)).toLocaleString()} ETB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t.classSize}</p>
                  <p className="text-lg font-semibold dark:text-white">
                    {t.maxStudents.replace("{count}", course.max_students.toString())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
                  <Globe className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t.language}</p>
                  <p className="text-lg font-semibold dark:text-white">
                    {course.language_taught === "de" ? t.german : t.amharic}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t.levelLabel}</p>
                  <p className="text-lg font-semibold dark:text-white">{getLevelLabel(course.level, t)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
