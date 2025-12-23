import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ScheduleForm } from "@/components/admin/schedule-form"

interface EditSchedulePageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditSchedulePage({ params }: EditSchedulePageProps) {
    const { id } = await params
    await requireRole(["admin"])
    const supabase = await createClient()

    const { data: schedule, error } = await supabase
        .from("course_schedules")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !schedule) {
        notFound()
    }

    return (
        <DashboardLayout role="admin">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Schedule</h1>
                    <p className="text-muted-foreground mt-2">
                        Update the schedule timing, instructor, or status.
                    </p>
                </div>

                <ScheduleForm initialData={schedule} scheduleId={id} />
            </div>
        </DashboardLayout>
    )
}
