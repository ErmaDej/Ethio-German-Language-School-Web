"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function CTASection() {
  const { language } = useLanguage()
  const t = translations[language]
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <section className="py-20 md:py-32 bg-blue-600 h-[400px]">
        <div className="container mx-auto px-4 text-center">
          <div className="h-10 w-64 animate-pulse bg-blue-500 rounded mx-auto mb-6" />
          <div className="h-6 w-96 animate-pulse bg-blue-400 rounded mx-auto mb-8" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-black transition-colors duration-500 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-white/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-blue-400/20 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-bold text-white mb-8 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span>{t.startFreeTrial}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl mb-8 leading-[1.1]"
          >
            {t.ctaTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-blue-50 mb-12 leading-relaxed font-medium max-w-2xl mx-auto"
          >
            {t.ctaSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100 text-lg font-black h-14 px-10 shadow-2xl shadow-black/20 hover:scale-105 transition-all">
              <Link href="/auth/sign-up" className="flex items-center gap-2">
                {t.getStarted}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-2 border-white/30 hover:bg-white/10 text-lg font-bold h-14 px-10 backdrop-blur-sm hover:scale-105 transition-all bg-transparent"
            >
              <Link href="/contact">{t.contactUs}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

