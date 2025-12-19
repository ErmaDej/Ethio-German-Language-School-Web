import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UserManagementTable } from "@/components/admin/user-management-table"

export default async function AdminUsersPage() {
  await requireRole(["admin"])
  const supabase = await createClient()

  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage students, instructors, and administrators</p>
        </div>

        <UserManagementTable users={users || []} />
      </div>
    </DashboardLayout>
  )
}
