import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AdminCourseCard } from "@/components/admin/admin-course-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AdminCoursesPage() {
  await requireRole(["admin"])
  const supabase = await createClient()

  const { data: courses } = await supabase.from("courses").select("*").order("created_at", { ascending: false })

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Courses Management</h1>
            <p className="text-muted-foreground mt-2">Create and manage language courses</p>
          </div>
          <Button asChild>
            <Link href="/admin/courses/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Link>
          </Button>
        </div>

        {!courses || courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No courses created yet</p>
            <Button asChild>
              <Link href="/admin/courses/create">Create Your First Course</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {courses.map((course) => (
              <AdminCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
