"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Globe, Users, Award, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function HeroSection() {
  const { language } = useLanguage()
  const t = translations[language]
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <section className="relative overflow-hidden bg-white dark:bg-gray-950 py-20 md:py-32 h-[600px]">
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-full mb-8" />
          <div className="h-16 w-full max-w-2xl animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg mb-6" />
          <div className="h-24 w-full max-w-xl animate-pulse bg-gray-100 dark:bg-gray-900 rounded-lg" />
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/50 py-20 md:py-32 transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40 dark:opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-400/20 blur-[120px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 dark:bg-blue-900/40 dark:border-blue-800 px-5 py-2 text-sm font-bold text-blue-800 dark:text-blue-300 w-fit shadow-sm backdrop-blur-sm">
                <Globe className="h-4 w-4 animate-spin-slow" />
                <span>{t.germanSchoolBadge}</span>
              </div>

              {/* Persistently Animated Slogan */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold italic text-sm md:text-base"
              >
                <Sparkles className="h-4 w-4 animate-pulse" />
                <motion.span
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [0.98, 1, 0.98]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  &quot;{t.animatedSlogan}&quot;
                </motion.span>
              </motion.div>
            </div>

            <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl text-balance">
              {t.heroTitle.split("with")[0]}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-600 bg-clip-text text-transparent block sm:inline">
                {t.heroTitle.includes("with") ? ` with ${t.heroTitle.split("with")[1]}` : ""}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100 leading-relaxed text-pretty max-w-xl font-semibold dark:drop-shadow-sm">
              {t.heroSubtitle} {t.heroDescriptionExtra}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold h-14 px-8 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-105 transition-all duration-300">
                <Link href="/courses">
                  {t.exploreCourses}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg font-bold h-14 px-8 bg-white/50 dark:bg-white/5 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10 dark:text-white hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                <Link href="/about">{t.learnMore}</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-10 pt-6">
              <div className="flex items-center gap-4 group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/50 shadow-inner group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7 text-blue-700 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">500+</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t.activeStudents}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-900/50 shadow-inner group-hover:scale-110 transition-transform">
                  <Award className="h-7 w-7 text-orange-700 dark:text-orange-300" />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">20+</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t.expertInstructors}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative mt-12 lg:mt-0"
          >
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-white dark:border-gray-800">
              <img
                src="/ethiopian-students-learning-german-language-in-mod.jpg"
                alt="Ethiopian students learning German at EthioGerman Language School"
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
            </div>

            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 rounded-[1.5rem] bg-white dark:bg-gray-800 p-5 shadow-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-md"
            >
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t.nextCohortStarts}</p>
              <p className="text-2xl font-black text-blue-700 dark:text-blue-400">March 2024</p>
            </motion.div>

            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-6 -right-6 md:-top-8 md:-right-8 rounded-[1.5rem] bg-white dark:bg-gray-800 p-5 shadow-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-md"
            >
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t.successRate}</p>
              <p className="text-2xl font-black text-orange-600 dark:text-orange-400">95%</p>
            </motion.div>

            {/* Floating decorative dots */}
            <div className="absolute -z-10 top-1/2 -right-12 w-24 h-24 bg-blue-200/50 dark:bg-blue-800/30 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -z-10 bottom-1/4 -left-12 w-32 h-32 bg-orange-200/50 dark:bg-orange-800/30 rounded-full blur-2xl animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

