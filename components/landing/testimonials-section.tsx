"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function TestimonialsSection() {
  const { language } = useLanguage()
  const t = translations[language]
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const testimonials = [
    {
      name: t.testimonial1Name,
      role: t.testimonial1Role,
      avatar: "/professional-woman-smiling.png",
      content: t.testimonial1Content,
      rating: 5,
    },
    {
      name: t.testimonial2Name,
      role: t.testimonial2Role,
      avatar: "/professional-man-smiling.png",
      content: t.testimonial2Content,
      rating: 5,
    },
    {
      name: t.testimonial3Name,
      role: t.testimonial3Role,
      avatar: "/smiling-student.png",
      content: t.testimonial3Content,
      rating: 5,
    },
  ]

  if (!mounted) {
    return (
      <section className="py-20 md:py-32 bg-white dark:bg-gray-950 h-[600px]">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded mx-auto mb-16" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse bg-gray-100 dark:bg-gray-900 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-32 bg-white dark:bg-gray-950 transition-colors duration-500 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl mb-6"
          >
            {t.testimonialsTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium"
          >
            {t.testimonialsSubtitle}
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="flex flex-col h-full border-2 border-gray-100 dark:border-gray-800 hover:border-blue-500/20 hover:shadow-2xl transition-all duration-500 dark:bg-gray-900 overflow-hidden relative group">
                <CardContent className="pt-10 pb-8 px-8">
                  <Quote className="absolute top-6 right-8 h-12 w-12 text-blue-500/10 group-hover:text-blue-500/20 transition-colors" />

                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-orange-400 text-orange-400" />
                    ))}
                  </div>

                  <p className="text-gray-800 dark:text-gray-200 mb-8 leading-relaxed font-medium text-lg italic relative z-10">
                    &quot;{testimonial.content}&quot;
                  </p>

                  <div className="flex items-center gap-4 mt-auto">
                    <div className="relative">
                      <Avatar className="h-14 w-14 border-2 border-blue-100 dark:border-blue-900">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} className="object-cover" />
                        <AvatarFallback className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


