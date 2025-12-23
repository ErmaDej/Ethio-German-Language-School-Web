import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CourseForm } from "@/components/admin/course-form"

interface EditCoursePageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
    const { id } = await params
    await requireRole(["admin"])
    const supabase = await createClient()

    const { data: course, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !course) {
        notFound()
    }

    return (
        <DashboardLayout role="admin">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
                    <p className="text-muted-foreground mt-2">
                        Update the course details and availability.
                    </p>
                </div>

                <CourseForm initialData={course} courseId={id} />
            </div>
        </DashboardLayout>
    )
}
