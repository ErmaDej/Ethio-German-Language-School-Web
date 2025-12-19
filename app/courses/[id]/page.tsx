"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { CourseDetails } from "@/components/courses/course-details"
import { CourseSchedules } from "@/components/courses/course-schedules"
import { notFound, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export default function CourseDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [course, setCourse] = useState<any>(null)
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    async function fetchCourseData() {
      const supabase = createClient()

      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single()

      if (courseError || !courseData) {
        setLoading(false)
        return
      }

      const { data: schedulesData } = await supabase
        .from("course_schedules")
        .select(`
          *,
          instructor:profiles(full_name, avatar_url)
        `)
        .eq("course_id", id)
        .in("status", ["upcoming", "ongoing"])
        .order("start_date", { ascending: true })

      setCourse(courseData)
      setSchedules(schedulesData || [])
      setLoading(false)
    }

    if (id) {
      fetchCourseData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />
        <main className="py-12">
          <div className="container mx-auto px-4">
            <div className="h-64 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-xl mb-12" />
            <div className="h-96 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-xl" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <CourseDetails course={course} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 dark:text-white">{t.availableSchedules}</h2>
            <CourseSchedules schedules={schedules} courseId={id} />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

