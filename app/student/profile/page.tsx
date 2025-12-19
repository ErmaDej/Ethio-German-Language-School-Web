import { requireRole } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProfileForm } from "@/components/student/profile-form"

export default async function ProfilePage() {
  const profile = await requireRole(["student"])

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and preferences</p>
        </div>

        <ProfileForm profile={profile} />
      </div>
    </DashboardLayout>
  )
}
