import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AdminScheduleCard } from "@/components/admin/admin-schedule-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AdminSchedulesPage() {
  await requireRole(["admin"])
  const supabase = await createClient()

  const { data: schedules } = await supabase
    .from("course_schedules")
    .select(
      `
      *,
      course:courses(title),
      instructor:profiles(full_name)
    `,
    )
    .order("start_date", { ascending: false })

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schedule Management</h1>
            <p className="text-muted-foreground mt-2">Create and manage course schedules</p>
          </div>
          <Button asChild>
            <Link href="/admin/schedules/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </Link>
          </Button>
        </div>

        {!schedules || schedules.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No schedules created yet</p>
            <Button asChild>
              <Link href="/admin/schedules/create">Create Your First Schedule</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {schedules.map((schedule: any) => (
              <AdminScheduleCard key={schedule.id} schedule={schedule} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
