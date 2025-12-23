"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AdminCourseCard } from "@/components/admin/admin-course-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Search, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    async function fetchCourses() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching courses:", error)
      } else {
        setCourses(data || [])
        setFilteredCourses(data || [])
      }
      setLoading(false)
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    const query = searchQuery.toLowerCase()
    const filtered = courses.filter((course) => {
      const title = (course.title[language] || course.title.en || "").toLowerCase()
      const level = (course.level || "").toLowerCase()
      return title.includes(query) || level.includes(query)
    })
    setFilteredCourses(filtered)
  }, [searchQuery, courses, language])

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight dark:text-white">{t.availableCourses}</h1>
            <p className="text-muted-foreground mt-2">Create and manage your German language courses.</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/admin/courses/create">
              <Plus className="h-4 w-4 mr-2" />
              {t.createCourse}
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              className="pl-10 dark:bg-gray-900 dark:border-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed dark:border-gray-800">
            <p className="text-muted-foreground mb-4">No courses found</p>
            {searchQuery ? (
              <Button variant="ghost" onClick={() => setSearchQuery("")}>Clear search</Button>
            ) : (
              <Button asChild>
                <Link href="/admin/courses/create">Create Your First Course</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCourses.map((course) => (
              <AdminCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
