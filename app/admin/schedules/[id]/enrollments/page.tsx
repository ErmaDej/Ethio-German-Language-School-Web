"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, ArrowLeft, Mail, Loader2, Users } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { useParams } from "next/navigation"

export default function ScheduleEnrollmentsPage() {
    const params = useParams()
    const id = params.id as string
    const [schedule, setSchedule] = useState<any>(null)
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { language } = useLanguage()
    const t = translations[language]

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()

            const { data: scheduleData } = await supabase
                .from("course_schedules")
                .select("*, course:courses(title)")
                .eq("id", id)
                .single()

            setSchedule(scheduleData)

            const { data: enrollmentsData } = await supabase
                .from("enrollments")
                .select(`
          *,
          student:profiles(*)
        `)
                .eq("schedule_id", id)
                .order("enrolled_at", { ascending: false })

            setEnrollments(enrollmentsData || [])
            setLoading(false)
        }

        if (id) fetchData()
    }, [id])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none"
            case "pending":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-none"
            case "cancelled":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none"
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-none"
        }
    }

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon" className="dark:text-gray-400">
                        <Link href={schedule ? `/admin/courses/${schedule.course_id}/schedules` : "/admin/schedules"}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight dark:text-white">{t.recentEnrollments || "Enrollments"}</h1>
                        <p className="text-muted-foreground mt-2">
                            {schedule ? `${schedule.course.title[language] || schedule.course.title.en} (${schedule.time_start.slice(0, 5)})` : "Managing students"}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                        <p className="text-gray-500">Loading enrollments...</p>
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed dark:border-gray-800">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-muted-foreground">No students enrolled in this schedule yet.</p>
                    </div>
                ) : (
                    <div className="rounded-xl border dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                    <TableHead className="w-[300px]">Student</TableHead>
                                    <TableHead>Enrolled At</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enrollments.map((enrollment: any) => (
                                    <TableRow key={enrollment.id} className="dark:border-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border dark:border-gray-700">
                                                    <AvatarImage src={enrollment.student.avatar_url} />
                                                    <AvatarFallback className="bg-blue-50 text-blue-600">
                                                        <User className="h-5 w-5" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold dark:text-gray-200">{enrollment.student.full_name}</p>
                                                    <p className="text-xs text-muted-foreground">{enrollment.student.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                            {format(new Date(enrollment.enrolled_at), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(enrollment.enrollment_status)}>
                                                {t[enrollment.enrollment_status as keyof typeof t] || enrollment.enrollment_status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                                                {t[enrollment.payment_status as keyof typeof t] || enrollment.payment_status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 dark:text-gray-400" title="Email Student">
                                                    <a href={`mailto:${enrollment.student.email}`}>
                                                        <Mail className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button asChild size="sm" variant="outline" className="h-8 dark:border-gray-700 dark:text-gray-300">
                                                    <Link href={`/admin/enrollments/${enrollment.id}`}>
                                                        {t.edit}
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
