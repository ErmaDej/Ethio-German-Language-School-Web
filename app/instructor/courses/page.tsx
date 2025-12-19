import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { InstructorCourseCard } from "@/components/instructor/instructor-course-card"

export default async function InstructorCoursesPage() {
  const profile = await requireRole(["instructor"])
  const supabase = await createClient()

  const { data: schedules } = await supabase
    .from("course_schedules")
    .select(
      `
      *,
      course:courses(*)
    `,
    )
    .eq("instructor_id", profile.id)
    .order("start_date", { ascending: false })

  return (
    <DashboardLayout role="instructor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground mt-2">Manage your course schedules and content</p>
        </div>

        {!schedules || schedules.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses assigned yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {schedules.map((schedule: any) => (
              <InstructorCourseCard key={schedule.id} schedule={schedule} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
