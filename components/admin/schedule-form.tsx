"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const scheduleSchema = z.object({
    course_id: z.string().min(1, "Please select a course"),
    instructor_id: z.string().min(1, "Please select an instructor"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    time_start: z.string().min(1, "Start time is required"),
    time_end: z.string().min(1, "End time is required"),
    days_of_week: z.array(z.number()).min(1, "Select at least one day"),
    available_seats: z.number().min(0),
    status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]),
})

type ScheduleFormValues = z.infer<typeof scheduleSchema>

interface ScheduleFormProps {
    initialData?: any
    scheduleId?: string
}

export function ScheduleForm({ initialData, scheduleId }: ScheduleFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [courses, setCourses] = useState<any[]>([])
    const [instructors, setInstructors] = useState<any[]>([])
    const router = useRouter()
    const { language } = useLanguage()
    const t = translations[language]
    const supabase = createClient()

    const searchParams = useSearchParams()
    const defaultCourseId = searchParams.get("course_id") || ""

    const form = useForm<ScheduleFormValues>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: initialData || {
            course_id: defaultCourseId,
            instructor_id: "",
            start_date: "",
            end_date: "",
            time_start: "",
            time_end: "",
            days_of_week: [],
            available_seats: 15,
            status: "upcoming",
        },
    })

    useEffect(() => {
        async function fetchData() {
            const { data: coursesData } = await supabase.from("courses").select("id, title")
            const { data: instructorsData } = await supabase
                .from("profiles")
                .select("id, full_name")
                .contains("role", ["instructor"])

            setCourses(coursesData || [])
            setInstructors(instructorsData || [])
        }
        fetchData()
    }, [])

    async function onSubmit(values: ScheduleFormValues) {
        setIsLoading(true)
        try {
            if (scheduleId) {
                const { error } = await supabase
                    .from("course_schedules")
                    .update({
                        ...values,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", scheduleId)

                if (error) throw error
                toast.success(t.scheduleUpdated)
            } else {
                const { error } = await supabase.from("course_schedules").insert({
                    ...values,
                    timezone: "Africa/Addis_Ababa",
                })

                if (error) throw error
                toast.success(t.scheduleCreated)
            }
            router.push("/admin/schedules")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const days = [
        { label: language === "am" ? "ሰኞ" : "Mon", value: 1 },
        { label: language === "am" ? "ማክሰኞ" : "Tue", value: 2 },
        { label: language === "am" ? "ረቡዕ" : "Wed", value: 3 },
        { label: language === "am" ? "ሐሙስ" : "Thu", value: 4 },
        { label: language === "am" ? "አርብ" : "Fri", value: 5 },
        { label: language === "am" ? "ቅዳሜ" : "Sat", value: 6 },
        { label: language === "am" ? "እሁድ" : "Sun", value: 0 },
    ]

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card className="dark:bg-gray-900 dark:border-gray-800">
                    <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="course_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.selectCourse}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select course" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {courses.map((course) => (
                                                <SelectItem key={course.id} value={course.id}>
                                                    {course.title[language] || course.title.en}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="instructor_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.selectInstructor}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select instructor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {instructors.map((instructor) => (
                                                <SelectItem key={instructor.id} value={instructor.id}>
                                                    {instructor.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="start_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.startDate}</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="end_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.endDate}</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="time_start"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.startTime}</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="time_end"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.endTime}</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="md:col-span-2">
                            <FormField
                                control={form.control}
                                name="days_of_week"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">{t.daysOfWeek}</FormLabel>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {days.map((day) => (
                                                <FormField
                                                    key={day.value}
                                                    control={form.control}
                                                    name="days_of_week"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={day.value}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(day.value)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, day.value])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== day.value
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    {day.label}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="available_seats"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.availableSeats}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.status}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="upcoming">{t.upcoming}</SelectItem>
                                            <SelectItem value="ongoing">{t.ongoing}</SelectItem>
                                            <SelectItem value="completed">{t.completed}</SelectItem>
                                            <SelectItem value="cancelled">{t.cancelled}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        {t.cancel}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t.saveSchedule}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
