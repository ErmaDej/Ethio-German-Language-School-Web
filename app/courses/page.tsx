"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { CourseGrid } from "@/components/courses/course-grid"
import { CourseFilters } from "@/components/courses/course-filters"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    async function fetchCourses() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching courses:", error)
      } else {
        setCourses(data || [])
      }
      setLoading(false)
    }

    fetchCourses()
  }, [])

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900/20 py-16">
          <div className="container mx-auto px-4">
            <motion.div {...fadeIn}>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                {t.exploreCoursesTitle}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                {t.exploreCoursesSubtitle}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="lg:w-64 flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <CourseFilters />
                </motion.div>
              </aside>
              <div className="flex-1">
                {loading ? (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-[400px] rounded-xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <CourseGrid courses={courses} />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

