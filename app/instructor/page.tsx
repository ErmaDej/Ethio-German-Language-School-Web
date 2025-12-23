"use client"

import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, FileText, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export default function InstructorDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [schedules, setSchedules] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { language } = useLanguage()
  const t = translations[language]
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        setProfile(profileData)

        // Get instructor's courses
        const { data: schedulesData } = await supabase
          .from("course_schedules")
          .select(`
            *,
            course:courses(*)
          `)
          .eq("instructor_id", user.id)

        setSchedules(schedulesData || [])

        if (schedulesData && schedulesData.length > 0) {
          const scheduleIds = schedulesData.map((s) => s.id)

          // Get total students
          const { count } = await supabase
            .from("enrollments")
            .select("*", { count: "exact", head: true })
            .in("schedule_id", scheduleIds)
            .eq("enrollment_status", "confirmed")

          setTotalStudents(count || 0)

          // Get assignments
          const { data: assignmentsData } = await supabase
            .from("assignments")
            .select("*")
            .in("schedule_id", scheduleIds)
            .order("due_date", { ascending: true })
            .limit(10)

          setAssignments(assignmentsData || [])
        }
      } catch (error) {
        console.error("Error fetching instructor data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (isLoading) {
    return (
      <DashboardLayout role="instructor">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  const activeSchedules = schedules.filter((s) => s.status === "ongoing" || s.status === "upcoming")

  return (
    <DashboardLayout role="instructor">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">
            {t.welcomeBack}, {profile?.full_name}!
          </h1>
          <p className="text-muted-foreground mt-2 dark:text-gray-400">{t.manageYourCourses}</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: t.activeCourses, value: activeSchedules.length, sub: t.currentlyTeaching, icon: BookOpen },
            { title: t.students, value: totalStudents, sub: t.enrolledStudents, icon: Users },
            { title: t.assignments, value: assignments.length, sub: t.createdAssignments, icon: FileText },
            { title: t.allSchedules, value: schedules.length, sub: t.totalSchedulesLabel, icon: Calendar },
          ].map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-300">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground dark:text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{stat.value}</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">{stat.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="dark:bg-gray-900 dark:border-gray-800 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="dark:text-white">{t.myCourses}</CardTitle>
                  <Button asChild variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    <Link href="/instructor/courses">{t.viewAll}</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeSchedules.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground dark:text-gray-400">{t.noActiveCourses}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeSchedules.slice(0, 5).map((schedule: any) => (
                      <div key={schedule.id} className="flex items-center justify-between border-b dark:border-gray-800 pb-4 last:border-0">
                        <div className="flex-1">
                          <p className="font-medium dark:text-gray-200">{schedule.course.title[language] || schedule.course.title.en}</p>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">{schedule.available_seats} {t.seatsLeft}</p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800">
                          <Link href={`/instructor/courses/${schedule.id}`}>{t.view}</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="dark:bg-gray-900 dark:border-gray-800 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="dark:text-white">{t.recentAssignments}</CardTitle>
                  <Button asChild variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    <Link href="/instructor/assignments">{t.viewAll}</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {assignments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground dark:text-gray-400">{t.noUpcomingAssignments}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.slice(0, 5).map((assignment: any) => (
                      <div key={assignment.id} className="flex items-center justify-between border-b dark:border-gray-800 pb-4 last:border-0">
                        <div className="flex-1">
                          <p className="font-medium dark:text-gray-200">{assignment.title[language] || assignment.title.en}</p>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">
                            {t.due}: {new Date(assignment.due_date).toLocaleDateString(language === 'am' ? 'am-ET' : language === 'de' ? 'de-DE' : 'en-US')}
                          </p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800">
                          <Link href={`/instructor/assignments/${assignment.id}`}>{t.view}</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
