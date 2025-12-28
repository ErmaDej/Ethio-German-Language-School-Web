import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EnrollmentCard } from "@/components/student/enrollment-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Clock } from "lucide-react"

export default async function EnrollmentsPage({
  searchParams,
}: {
  searchParams: { payment?: string; enrolled?: string }
}) {
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

  const paymentSuccess = searchParams?.payment === "success"
  const enrollmentPending = searchParams?.enrolled === "pending"

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Enrollments</h1>
          <p className="text-muted-foreground mt-2">Manage your course enrollments and track your progress</p>
        </div>

        {enrollmentPending && (
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-300">
              Enrollment submitted! Your enrollment is pending admin approval. You will be notified once approved and can then proceed with payment.
            </AlertDescription>
          </Alert>
        )}

        {paymentSuccess && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300">
              Payment successful! Your enrollment has been confirmed.
            </AlertDescription>
          </Alert>
        )}

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
