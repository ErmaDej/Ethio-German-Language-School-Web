"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const courseSchema = z.object({
    title: z.object({
        en: z.string().min(1, "Title is required"),
        de: z.string().min(1, "Titel ist erforderlich"),
        am: z.string().min(1, "ርዕስ ያስፈልጋል"),
    }),
    description: z.object({
        en: z.string().min(1, "Description is required"),
        de: z.string().min(1, "Beschreibung ist erforderlich"),
        am: z.string().min(1, "መግለጫ ያስፈልጋል"),
    }),
    short_description: z.object({
        en: z.string().optional(),
        de: z.string().optional(),
        am: z.string().optional(),
    }),
    level: z.enum(["beginner", "elementary", "intermediate", "upper_intermediate", "advanced", "proficient"]),
    delivery_method: z.enum(["online", "onsite", "one_to_one"]),
    duration_weeks: z.number().min(1),
    hours_per_week: z.number().min(1),
    max_students: z.number().min(1),
    price_usd: z.number().min(0),
    is_active: z.boolean().default(true),
    thumbnail_url: z.string().optional(),
})

type CourseFormValues = z.infer<typeof courseSchema>

interface CourseFormProps {
    initialData?: any
    courseId?: string
}

export function CourseForm({ initialData, courseId }: CourseFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { language } = useLanguage()
    const t = translations[language]
    const supabase = createClient()

    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues: initialData || {
            title: { en: "", de: "", am: "" },
            description: { en: "", de: "", am: "" },
            short_description: { en: "", de: "", am: "" },
            level: "beginner",
            delivery_method: "online",
            duration_weeks: 8,
            hours_per_week: 6,
            max_students: 15,
            price_usd: 250,
            is_active: true,
            thumbnail_url: "",
        },
    })

    async function onSubmit(values: CourseFormValues) {
        setIsLoading(true)
        try {
            if (courseId) {
                const { error } = await supabase
                    .from("courses")
                    .update({
                        ...values,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", courseId)

                if (error) throw error
                toast.success(t.courseUpdated)
            } else {
                const { error } = await supabase.from("courses").insert({
                    ...values,
                    language_taught: "de", // Specialized German-only school
                })

                if (error) throw error
                toast.success(t.courseCreated)
            }
            router.push("/admin/courses")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="en">{t.english}</TabsTrigger>
                        <TabsTrigger value="de">{t.german}</TabsTrigger>
                        <TabsTrigger value="am">{t.amharic}</TabsTrigger>
                    </TabsList>

                    {["en", "de", "am"].map((lang) => (
                        <TabsContent key={lang} value={lang} className="space-y-4">
                            <FormField
                                control={form.control}
                                name={`title.${lang}` as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.courseTitle} ({lang.toUpperCase()})</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t.courseTitle} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`short_description.${lang}` as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.shortDescription} ({lang.toUpperCase()})</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t.shortDescription} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`description.${lang}` as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.courseDescription} ({lang.toUpperCase()})</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t.courseDescription}
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>
                    ))}
                </Tabs>

                <Card className="dark:bg-gray-900 dark:border-gray-800">
                    <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.level}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="beginner">A1 - Beginner</SelectItem>
                                            <SelectItem value="elementary">A2 - Elementary</SelectItem>
                                            <SelectItem value="intermediate">B1 - Intermediate</SelectItem>
                                            <SelectItem value="upper_intermediate">B2 - Upper Intermediate</SelectItem>
                                            <SelectItem value="advanced">C1 - Advanced</SelectItem>
                                            <SelectItem value="proficient">C2 - Proficient/Mastery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="delivery_method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.deliveryMethod}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="online">{t.onlineClass}</SelectItem>
                                            <SelectItem value="onsite">{t.onsiteClass}</SelectItem>
                                            <SelectItem value="one_to_one">{t.oneToOne}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="duration_weeks"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.durationWeeks}</FormLabel>
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
                            name="hours_per_week"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.hoursPerWeek}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="max_students"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.maxStudentsLabel || "Max Students"}</FormLabel>
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
                            name="price_usd"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.priceEtb || "Price (ETB)"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">{t.isActive}</FormLabel>
                                        <FormDescription>
                                            Show this course on the website
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
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
                        {t.cancel || "Cancel"}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t.saveCourse}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
