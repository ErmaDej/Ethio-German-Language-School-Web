import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EnrollmentCard } from "@/components/student/enrollment-card"

export default async function EnrollmentsPage() {
  const profile = await requireRole(["student"])
  const supabase = await createClient()

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      schedule:course_schedules(
        *,
        course:courses(*),
        instructor:profiles(full_name, avatar_url)
      )
    `,
    )
    .eq("student_id", profile.id)
    .order("enrolled_at", { ascending: false })

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Enrollments</h1>
          <p className="text-muted-foreground mt-2">Manage your course enrollments and track your progress</p>
        </div>

        {!enrollments || enrollments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No enrollments found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {enrollments.map((enrollment: any) => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
