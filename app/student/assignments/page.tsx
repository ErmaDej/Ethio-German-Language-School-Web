import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AssignmentCard } from "@/components/student/assignment-card"

export default async function AssignmentsPage() {
  const profile = await requireRole(["student"])
  const supabase = await createClient()

  // Get student's enrollments first
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("schedule_id")
    .eq("student_id", profile.id)
    .eq("enrollment_status", "confirmed")

  const scheduleIds = enrollments?.map((e) => e.schedule_id) || []

  // Get assignments for enrolled courses
  const { data: assignments } = await supabase
    .from("assignments")
    .select(
      `
      *,
      schedule:course_schedules(
        course:courses(title)
      ),
      submission:assignment_submissions(*)
    `,
    )
    .in("schedule_id", scheduleIds)
    .order("due_date", { ascending: true })

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground mt-2">View and submit your course assignments</p>
        </div>

        {!assignments || assignments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No assignments found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {assignments.map((assignment: any) => (
              <AssignmentCard key={assignment.id} assignment={assignment} studentId={profile.id} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
