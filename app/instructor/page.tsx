import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, FileText, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function InstructorDashboard() {
  const profile = await requireRole(["instructor"])
  const supabase = await createClient()

  // Get instructor's courses
  const { data: schedules } = await supabase
    .from("course_schedules")
    .select(
      `
      *,
      course:courses(*),
      enrollments:enrollments(count)
    `,
    )
    .eq("instructor_id", profile.id)

  const activeSchedules = schedules?.filter((s) => s.status === "ongoing") || []

  // Get total students across all courses
  const { count: totalStudents } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .in("schedule_id", schedules?.map((s) => s.id) || [])
    .eq("enrollment_status", "confirmed")

  // Get assignments
  const { data: assignments } = await supabase
    .from("assignments")
    .select("*")
    .in("schedule_id", schedules?.map((s) => s.id) || [])

  return (
    <DashboardLayout role="instructor">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {profile.full_name}!</h1>
          <p className="text-muted-foreground mt-2">Manage your courses and students</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSchedules.length}</div>
              <p className="text-xs text-muted-foreground">Currently teaching</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents || 0}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Created assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">All Schedules</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schedules?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Total schedules</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Courses</CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/instructor/courses">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeSchedules.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active courses</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeSchedules.slice(0, 3).map((schedule: any) => (
                    <div key={schedule.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{schedule.course.title.en}</p>
                        <p className="text-sm text-muted-foreground">{schedule.available_seats} seats available</p>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/instructor/courses/${schedule.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Assignments</CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/instructor/assignments">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!assignments || assignments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No assignments yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.slice(0, 3).map((assignment: any) => (
                    <div key={assignment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{assignment.title.en}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/instructor/assignments/${assignment.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
