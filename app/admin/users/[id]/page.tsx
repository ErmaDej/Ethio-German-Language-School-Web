import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, Calendar, User, BookOpen, GraduationCap } from "lucide-react"
import { format } from "date-fns"

interface UserDetailsPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
    const { id } = await params
    await requireRole(["admin"])
    const supabase = await createClient()

    // Fetch basic user profile
    const { data: user, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single()

    if (userError || !user) {
        notFound()
    }

    // Fetch related data based on role
    let enrollments = []
    let teachingSchedules = []

    if (user.role === "student") {
        const { data } = await supabase
            .from("enrollments")
            .select(`
        *,
        schedule:course_schedules(
            *,
            course:courses(*)
        )
      `)
            .eq("student_id", id)
            .order("enrolled_at", { ascending: false })
        enrollments = data || []
    } else if (user.role === "instructor") {
        const { data } = await supabase
            .from("course_schedules")
            .select(`
        *,
        course:courses(*)
      `)
            .eq("instructor_id", id)
            .order("start_date", { ascending: false })
        teachingSchedules = data || []
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "admin": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            case "instructor": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            case "student": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
        }
    }

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                {/* Header Profile Section */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <Card className="flex-1 w-full dark:bg-gray-900 dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <Avatar className="h-20 w-20 border-2 border-gray-100 dark:border-gray-800">
                                <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
                                <AvatarFallback className="text-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    {user.full_name?.charAt(0) || <User />}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <CardTitle className="text-2xl">{user.full_name}</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge className={getRoleBadgeColor(user.role)} variant="secondary">
                                        {user.role}
                                    </Badge>
                                    <Badge variant="outline" className="capitalize">
                                        {user.current_level || "Beginner"}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Phone className="h-4 w-4" />
                                <span>{user.phone || "No phone number"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4" />
                                <span>Joined {format(new Date(user.created_at), "MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <BookOpen className="h-4 w-4" />
                                <span>Language: {user.preferred_language?.toUpperCase() || "EN"}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Tabs */}
                <Tabs defaultValue={user.role === "instructor" ? "teaching" : "enrollments"} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        {user.role === "student" && (
                            <TabsTrigger value="enrollments">{user.full_name}'s Enrollments</TabsTrigger>
                        )}
                        {user.role === "instructor" && (
                            <TabsTrigger value="teaching">Teaching Schedule</TabsTrigger>
                        )}
                        <TabsTrigger value="activity">Recent Activity (Simulated)</TabsTrigger>
                    </TabsList>

                    {/* Student Enrollments View */}
                    {user.role === "student" && (
                        <TabsContent value="enrollments" className="mt-6 space-y-4">
                            {enrollments.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl dark:border-gray-800">
                                    <p className="text-gray-500">No enrollments found for this student.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {enrollments.map((enrollment: any) => (
                                        <Card key={enrollment.id} className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-lg font-semibold">{enrollment.schedule?.course?.title?.en || "Unknown Course"}</CardTitle>
                                                    <Badge variant={enrollment.enrollment_status === 'confirmed' ? 'default' : 'secondary'}>
                                                        {enrollment.enrollment_status}
                                                    </Badge>
                                                </div>
                                                <CardDescription className="line-clamp-1">
                                                    {enrollment.schedule?.course?.title?.am}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4 text-sm">
                                                <div className="flex items-center justify-between py-1 border-b dark:border-gray-800">
                                                    <span className="text-gray-500">Progress</span>
                                                    <span className="font-bold">{enrollment.progress_percentage || 0}%</span>
                                                </div>
                                                <div className="flex items-center justify-between py-1 border-b dark:border-gray-800">
                                                    <span className="text-gray-500">Payment</span>
                                                    <span className={`font-medium ${enrollment.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {enrollment.payment_status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between py-1">
                                                    <span className="text-gray-500">Schedule</span>
                                                    <span>{enrollment.schedule ? `${enrollment.schedule.time_start.slice(0, 5)} - ${enrollment.schedule.time_end.slice(0, 5)}` : "TBA"}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    )}

                    {/* Instructor Schedule View */}
                    {user.role === "instructor" && (
                        <TabsContent value="teaching" className="mt-6 space-y-4">
                            {teachingSchedules.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl dark:border-gray-800">
                                    <p className="text-gray-500">No classes assigned to this instructor.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {teachingSchedules.map((schedule: any) => (
                                        <Card key={schedule.id} className="dark:bg-gray-900 dark:border-gray-800">
                                            <CardHeader>
                                                <CardTitle className="text-lg">{schedule.course?.title?.en}</CardTitle>
                                                <CardDescription>
                                                    {format(new Date(schedule.start_date), "MMM d")} - {format(new Date(schedule.end_date), "MMM d, yyyy")}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <GraduationCap className="h-4 w-4 text-blue-500" />
                                                    <span className="text-sm font-medium">{schedule.course?.level?.toUpperCase()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{schedule.days?.join(", ")}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    )}

                    <TabsContent value="activity">
                        <Card className="dark:bg-gray-900 dark:border-gray-800">
                            <CardHeader>
                                <CardTitle>Recent Activity Log</CardTitle>
                                <CardDescription>System actions performed by {user.full_name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex gap-4 pb-4 border-b last:border-0 dark:border-gray-800">
                                            <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                                            <div>
                                                <p className="text-sm font-medium">Logged in to the portal</p>
                                                <p className="text-xs text-gray-500">
                                                    {format(new Date(Date.now() - i * 86400000), "PPP p")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
