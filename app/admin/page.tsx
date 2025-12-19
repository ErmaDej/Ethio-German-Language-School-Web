import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Calendar, DollarSign, TrendingUp, UserCheck } from "lucide-react"

export default async function AdminDashboard() {
  await requireRole(["admin"])
  const supabase = await createClient()

  // Get statistics
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: totalCourses } = await supabase.from("courses").select("*", { count: "exact", head: true })

  const { count: totalSchedules } = await supabase.from("course_schedules").select("*", { count: "exact", head: true })

  const { count: totalEnrollments } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("enrollment_status", "confirmed")

  const { count: pendingEnrollments } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("enrollment_status", "pending")

  // Calculate revenue (simplified)
  const { data: paidEnrollments } = await supabase
    .from("enrollments")
    .select(
      `
      schedule:course_schedules(
        course:courses(price_usd)
      )
    `,
    )
    .eq("payment_status", "paid")

  const totalRevenue = paidEnrollments?.reduce((sum, enrollment: any) => {
    return sum + (enrollment.schedule?.course?.price_usd || 0)
  }, 0)

  // Get recent enrollments
  const { data: recentEnrollments } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      student:profiles(full_name, email),
      schedule:course_schedules(
        course:courses(title)
      )
    `,
    )
    .order("enrolled_at", { ascending: false })
    .limit(5)

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your language school platform</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses || 0}</div>
              <p className="text-xs text-muted-foreground">Available courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Schedules</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSchedules || 0}</div>
              <p className="text-xs text-muted-foreground">Course schedules</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrollments || 0}</div>
              <p className="text-xs text-muted-foreground">Confirmed students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingEnrollments || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue?.toFixed(2) || "0.00"}</div>
              <p className="text-xs text-muted-foreground">From paid enrollments</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            {!recentEnrollments || recentEnrollments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No enrollments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEnrollments.map((enrollment: any) => (
                  <div key={enrollment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{enrollment.student?.full_name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">{enrollment.schedule?.course?.title.en}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(enrollment.enrolled_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          enrollment.enrollment_status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {enrollment.enrollment_status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          enrollment.payment_status === "paid"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
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
      </div>
    </DashboardLayout>
  )
}
