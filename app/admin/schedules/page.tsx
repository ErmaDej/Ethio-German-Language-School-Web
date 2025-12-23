"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AdminScheduleCard } from "@/components/admin/admin-schedule-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Loader2, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    async function fetchSchedules() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("course_schedules")
        .select(
          `
          *,
          course:courses(title),
          instructor:profiles(full_name)
        `,
        )
        .order("start_date", { ascending: false })

      if (error) {
        console.error("Error fetching schedules:", error)
      } else {
        setSchedules(data || [])
      }
      setLoading(false)
    }

    fetchSchedules()
  }, [])

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight dark:text-white">{t.scheduleManagement}</h1>
            <p className="text-muted-foreground mt-2">{t.scheduleManagementSub}</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/admin/schedules/create">
              <Plus className="h-4 w-4 mr-2" />
              {t.createSchedule}
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500">Loading schedules...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed dark:border-gray-800">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground mb-4">{t.noSchedulesYet}</p>
            <Button asChild>
              <Link href="/admin/schedules/create">{t.createFirstSchedule}</Link>
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
