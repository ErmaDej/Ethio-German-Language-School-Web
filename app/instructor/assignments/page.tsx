import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { InstructorAssignmentCard } from "@/components/instructor/instructor-assignment-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function InstructorAssignmentsPage() {
  const profile = await requireRole(["instructor"])
  const supabase = await createClient()

  const { data: schedules } = await supabase.from("course_schedules").select("id").eq("instructor_id", profile.id)

  const scheduleIds = schedules?.map((s) => s.id) || []

  const { data: assignments } = await supabase
    .from("assignments")
    .select(
      `
      *,
      schedule:course_schedules(
        course:courses(title)
      )
    `,
    )
    .in("schedule_id", scheduleIds)
    .order("due_date", { ascending: false })

  return (
    <DashboardLayout role="instructor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
            <p className="text-muted-foreground mt-2">Create and manage course assignments</p>
          </div>
          <Button asChild>
            <Link href="/instructor/assignments/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Link>
          </Button>
        </div>

        {!assignments || assignments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No assignments created yet</p>
            <Button asChild>
              <Link href="/instructor/assignments/create">Create Your First Assignment</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {assignments.map((assignment: any) => (
              <InstructorAssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
