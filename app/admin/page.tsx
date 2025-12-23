"use client"

import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Calendar, DollarSign, TrendingUp, UserCheck, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalCourses: 0,
    totalSchedules: 0,
    totalEnrollments: 0,
    pendingEnrollments: 0,
    totalRevenue: 0,
  })
  const [recentEnrollments, setRecentEnrollments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { language } = useLanguage()
  const t = translations[language]
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [
          { count: usersCount },
          { count: coursesCount },
          { count: schedulesCount },
          { count: enrollmentsCount },
          { count: pendingCount },
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("courses").select("*", { count: "exact", head: true }),
          supabase.from("course_schedules").select("*", { count: "exact", head: true }),
          supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("enrollment_status", "confirmed"),
          supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("enrollment_status", "pending"),
        ])

        // Calculate revenue
        const { data: paidEnrollments } = await supabase
          .from("enrollments")
          .select(`
            schedule:course_schedules(
              course:courses(price_usd)
            )
          `)
          .eq("payment_status", "paid")

        const revenue = paidEnrollments?.reduce((sum, enrollment: any) => {
          return sum + (enrollment.schedule?.course?.price_usd || 0)
        }, 0)

        setStats({
          totalUsers: usersCount || 0,
          totalCourses: coursesCount || 0,
          totalSchedules: schedulesCount || 0,
          totalEnrollments: enrollmentsCount || 0,
          pendingEnrollments: pendingCount || 0,
          totalRevenue: revenue || 0,
        })

        // Get recent enrollments
        const { data: recent } = await supabase
          .from("enrollments")
          .select(`
            *,
            student:profiles(full_name, email),
            schedule:course_schedules(
              course:courses(title)
            )
          `)
          .order("enrolled_at", { ascending: false })
          .limit(5)

        setRecentEnrollments(recent || [])
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">{t.dashboard}</h1>
          <p className="text-muted-foreground mt-2 dark:text-gray-400">Addis Ababa Language School Management</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: t.users, value: stats.totalUsers, sub: t.registeredUsers, icon: Users },
            { title: t.courses, value: stats.totalCourses, sub: t.availableCourses, icon: BookOpen },
            { title: t.allSchedules, value: stats.totalSchedules, sub: t.totalSchedulesLabel, icon: Calendar },
            { title: t.activeEnrollments, value: stats.totalEnrollments, sub: t.enrolledStudents, icon: UserCheck },
            { title: t.pending, value: stats.pendingEnrollments, sub: t.awaitingApproval, icon: TrendingUp },
            {
              title: t.totalRevenue,
              value: `$${stats.totalRevenue.toFixed(2)}`,
              sub: t.fromPaidEnrollments,
              icon: DollarSign,
              color: "text-green-600 dark:text-green-400"
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-300">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color || "text-muted-foreground dark:text-gray-500"}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold dark:text-white ${stat.color || ""}`}>{stat.value}</div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">{stat.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">{t.recentEnrollments}</CardTitle>
            </CardHeader>
            <CardContent>
              {recentEnrollments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground dark:text-gray-400">{t.noActiveCourses}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentEnrollments.map((enrollment: any) => (
                    <div key={enrollment.id} className="flex items-center justify-between border-b dark:border-gray-800 pb-4 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium dark:text-gray-200">{enrollment.student?.full_name || "Anonymous"}</p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                          {enrollment.schedule?.course?.title[language] || enrollment.schedule?.course?.title.en}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 dark:text-gray-500">
                          {new Date(enrollment.enrolled_at).toLocaleString(language === 'am' ? 'am-ET' : language === 'de' ? 'de-DE' : 'en-US')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${enrollment.enrollment_status === "confirmed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                        >
                          {enrollment.enrollment_status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${enrollment.payment_status === "paid"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                        >
                          {enrollment.payment_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
