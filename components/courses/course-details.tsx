"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Clock, DollarSign, Globe, TrendingUp, Users } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

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
      case "c2":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    }
  }

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
          <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
          <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
            {course.language_taught === "de" ? t.german : t.amharic}
          </Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          {course.title[language] || course.title.en}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          {course.description[language] || course.description.en}
        </p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.durationLabel}</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.timeCommitment}</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.price}</p>
                  <p className="text-lg font-semibold dark:text-white">${course.price_usd}</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.classSize}</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.language}</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.levelLabel}</p>
                  <p className="text-lg font-semibold dark:text-white capitalize">{course.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

