"use client"

import { BookOpen, Video, Calendar, MessageCircle, Award, Clock } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function FeaturesSection() {
  const { language } = useLanguage()
  const t = translations[language]
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: Video,
      title: t.liveInteractiveClasses,
      description: t.liveInteractiveClassesDesc,
      color: "blue"
    },
    {
      icon: BookOpen,
      title: t.comprehensiveCurriculum,
      description: t.comprehensiveCurriculumDesc,
      color: "indigo"
    },
    {
      icon: Calendar,
      title: t.flexibleScheduling,
      description: t.flexibleSchedulingDesc,
      color: "orange"
    },
    {
      icon: MessageCircle,
      title: t.aiLanguageAssistant,
      description: t.aiLanguageAssistantDesc,
      color: "green"
    },
    {
      icon: Award,
      title: t.certificationPrograms,
      description: t.certificationProgramsDesc,
      color: "purple"
    },
    {
      icon: Clock,
      title: t.selfPacedLearning,
      description: t.selfPacedLearningDesc,
      color: "red"
    },
  ]

  if (!mounted) {
    return (
      <section className="py-20 md:py-32 bg-white dark:bg-gray-950 h-[800px]">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded mx-auto mb-16" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 animate-pulse bg-gray-100 dark:bg-gray-900 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-32 bg-white dark:bg-gray-950 transition-colors duration-500 overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl mb-6"
          >
            {t.featuresTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium"
          >
            {t.featuresSubtitle}
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:-translate-y-2"
            >
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{feature.description}</p>

              {/* Decorative background element */}
              <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-blue-500/5 rounded-full blur-2xl transition-all group-hover:bg-blue-500/10 group-hover:scale-150" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

