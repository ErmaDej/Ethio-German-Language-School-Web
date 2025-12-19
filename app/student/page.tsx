"use client"

import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Award, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
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

        // Get student's enrollments
        const { data: enrollmentsData } = await supabase
          .from("enrollments")
          .select(`
            *,
            schedule:course_schedules(
              *,
              course:courses(*)
            )
          `)
          .eq("student_id", user.id)
          .in("enrollment_status", ["confirmed", "pending"])

        setEnrollments(enrollmentsData || [])

        // Get upcoming assignments
        if (enrollmentsData && enrollmentsData.length > 0) {
          const { data: assignmentsData } = await supabase
            .from("assignments")
            .select(`
              *,
              schedule:course_schedules(
                course:courses(title)
              )
            `)
            .in("schedule_id", enrollmentsData.map((e: any) => e.schedule_id))
            .gte("due_date", new Date().toISOString())
            .order("due_date", { ascending: true })
            .limit(5)

          setAssignments(assignmentsData || [])
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (isLoading) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  const activeEnrollments = enrollments.filter((e) => e.enrollment_status === "confirmed")
  const pendingEnrollments = enrollments.filter((e) => e.enrollment_status === "pending")

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">
            {t.welcomeBack}, {profile?.full_name}!
          </h1>
          <p className="text-muted-foreground mt-2 dark:text-gray-400">{t.learningProgress}</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: t.activeCourses, value: activeEnrollments.length, sub: t.currentlyEnrolled, icon: BookOpen },
            { title: t.pending, value: pendingEnrollments.length, sub: t.awaitingConfirmation, icon: Calendar },
            { title: t.assignments, value: assignments.length, sub: t.dueSoon, icon: Award },
            {
              title: t.avgProgress,
              value: activeEnrollments.length > 0
                ? Math.round(activeEnrollments.reduce((acc, e) => acc + (e.progress_percentage || 0), 0) / activeEnrollments.length)
                : 0,
              sub: t.overallCompletion,
              icon: TrendingUp,
              suffix: "%"
            }
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
                  <div className="text-2xl font-bold dark:text-white">{stat.value}{stat.suffix}</div>
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
                    <Link href="/student/enrollments">{t.viewAll}</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeEnrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4 dark:text-gray-400">{t.noActiveCourses}</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                      <Link href="/courses">{t.browseCourses}</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeEnrollments.slice(0, 3).map((enrollment: any) => (
                      <div key={enrollment.id} className="flex items-center justify-between border-b dark:border-gray-800 pb-4 last:border-0">
                        <div className="flex-1">
                          <p className="font-medium dark:text-gray-200">{enrollment.schedule.course.title[language] || enrollment.schedule.course.title.en}</p>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">{enrollment.progress_percentage}% {t.complete}</p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800">
                          <Link href={`/student/courses/${enrollment.schedule.course_id}`}>{t.viewDetails}</Link>
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
                  <CardTitle className="dark:text-white">{t.upcomingAssignments}</CardTitle>
                  <Button asChild variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    <Link href="/student/assignments">{t.viewAll}</Link>
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
                    {assignments.slice(0, 3).map((assignment: any) => (
                      <div key={assignment.id} className="flex items-center justify-between border-b dark:border-gray-800 pb-4 last:border-0">
                        <div className="flex-1">
                          <p className="font-medium dark:text-gray-200">{assignment.title[language] || assignment.title.en}</p>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">
                            {t.due}: {new Date(assignment.due_date).toLocaleDateString(language === 'am' ? 'am-ET' : language === 'de' ? 'de-DE' : 'en-US')}
                          </p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800">
                          <Link href={`/student/assignments/${assignment.id}`}>{t.viewDetails}</Link>
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

