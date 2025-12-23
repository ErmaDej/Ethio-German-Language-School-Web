"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CourseForm } from "@/components/admin/course-form"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export default function CreateCoursePage() {
    const { language } = useLanguage()
    const t = translations[language]

    return (
        <DashboardLayout role="admin">
            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight dark:text-white">{t.createCourse}</h1>
                    <p className="text-muted-foreground mt-2">
                        Add a new German language course to the catalog.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <CourseForm />
                </motion.div>
            </div>
        </DashboardLayout>
    )
}
