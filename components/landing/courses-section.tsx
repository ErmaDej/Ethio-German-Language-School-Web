"use client"

/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Clock, Users, TrendingUp, ChevronRight, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function CoursesSection() {
  const { language } = useLanguage()
  const t = translations[language]
  const [mounted, setMounted] = useState(false)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    async function fetchFeaturedCourses() {
      const supabase = createClient()
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .order("level", { ascending: true }) // Show beginner levels first on landing page
        .limit(3)

      if (data) {
        setCourses(data)
      }
      setLoading(false)
    }
    fetchFeaturedCourses()
  }, [])

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return "from-blue-400 to-blue-500"
      case 'elementary': return "from-blue-500 to-blue-600"
      case 'intermediate': return "from-indigo-500 to-indigo-600"
      default: return "from-blue-600 to-purple-600"
    }
  }

  if (!mounted) {
    return (
      <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900 h-[800px]">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded mx-auto mb-16" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse bg-gray-100 dark:bg-gray-950 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-500 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-orange-500/5 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl mb-6"
          >
            {t.coursesTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium"
          >
            {t.coursesSubtitle}
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="flex flex-col h-full hover:shadow-2xl transition-all duration-500 dark:bg-gray-950 dark:border-gray-800 border-2 border-transparent hover:border-blue-500/20 group overflow-hidden">
                  <CardHeader className="relative">
                    <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${getLevelColor(course.level)}`} />
                    <div className="flex items-center justify-between mb-4 pt-2">
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-none font-bold px-3 py-1 uppercase">
                        {course.level}
                      </Badge>
                      <div className="flex flex-col items-end">
                        <span className="text-xl font-black text-blue-700 dark:text-blue-400">{(course.price_usd).toLocaleString()} ETB</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">/ Month</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {course.title[language] || course.title.en}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed mt-2 line-clamp-2">
                      {course.short_description?.[language] || course.description?.[language] || course.description?.en}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pt-0">
                    <div className="flex flex-col gap-4 mt-4">
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span>{course.duration_weeks} {t.weeks}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span>{t.maxStudents?.replace("{count}", course.max_students.toString()) || `Max ${course.max_students}`}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span>{course.hours_per_week} {t.hoursPerWeek}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/30 transition-all">
                      <Link href={`/courses/${course.id}`} className="flex items-center justify-center gap-2">
                        {t.enrollNow}
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button asChild size="lg" variant="outline" className="font-bold h-14 px-10 border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200 transition-all">
              <Link href="/courses">{t.viewAllCourses}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


