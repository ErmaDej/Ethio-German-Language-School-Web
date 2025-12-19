import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StudentListCard } from "@/components/instructor/student-list-card"

export default async function InstructorStudentsPage() {
  const profile = await requireRole(["instructor"])
  const supabase = await createClient()

  // Get instructor's schedules
  const { data: schedules } = await supabase
    .from("course_schedules")
    .select("id, course:courses(title)")
    .eq("instructor_id", profile.id)

  const scheduleIds = schedules?.map((s) => s.id) || []

  // Get all students enrolled in these courses
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      student:profiles(*),
      schedule:course_schedules(
        course:courses(title)
      )
    `,
    )
    .in("schedule_id", scheduleIds)
    .eq("enrollment_status", "confirmed")
    .order("enrolled_at", { ascending: false })

  return (
    <DashboardLayout role="instructor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
          <p className="text-muted-foreground mt-2">View and manage your enrolled students</p>
        </div>

        {!enrollments || enrollments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No students enrolled yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {enrollments.map((enrollment: any) => (
              <StudentListCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
