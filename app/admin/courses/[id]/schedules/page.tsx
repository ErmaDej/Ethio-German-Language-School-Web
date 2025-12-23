"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AdminScheduleCard } from "@/components/admin/admin-schedule-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ArrowLeft, Loader2, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { useParams } from "next/navigation"

export default function CourseSchedulesPage() {
    const params = useParams()
    const id = params.id as string
    const [course, setCourse] = useState<any>(null)
    const [schedules, setSchedules] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { language } = useLanguage()
    const t = translations[language]

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()

            const { data: courseData } = await supabase
                .from("courses")
                .select("title")
                .eq("id", id)
                .single()

            setCourse(courseData)

            const { data: schedulesData } = await supabase
                .from("course_schedules")
                .select(`
          *,
          course:courses(title),
          instructor:profiles(full_name)
        `)
                .eq("course_id", id)
                .order("start_date", { ascending: false })

            setSchedules(schedulesData || [])
            setLoading(false)
        }

        if (id) fetchData()
    }, [id])

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon" className="dark:text-gray-400">
                            <Link href="/admin/courses">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight dark:text-white">
                                {language === 'am' ? 'የመርሐግብር ዝርዝር ለ ' : 'Schedules for '}
                                {course?.title[language] || course?.title.en}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {language === 'am' ? 'ለዚህ ኮርስ ጊዜዎችን እና አስተማሪዎችን ያስተዳድሩ' : 'Manage timing and instructors for this course'}
                            </p>
                        </div>
                    </div>
                    <Button asChild className="md:ml-auto bg-blue-600 hover:bg-blue-700">
                        <Link href={`/admin/schedules/create?course_id=${id}`}>
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
                            <Link href={`/admin/schedules/create?course_id=${id}`}>{t.createFirstSchedule}</Link>
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
