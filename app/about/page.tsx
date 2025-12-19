"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Users, Award, Globe } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export default function AboutPage() {
  const { language } = useLanguage()
  const t = translations[language]

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900/20 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div {...fadeIn}>
                <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{t.aboutHeroBadge}</Badge>
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 text-balance">
                  {t.aboutTitle}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed text-pretty">
                  {t.aboutSubtitle}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image src="/images/addis-ababa-skyline.jpg" alt="Addis Ababa skyline" fill className="object-cover" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t.ourStory}</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>{t.ourStoryText1}</p>
                  <p>{t.ourStoryText2}</p>
                  <p>{t.ourStoryText3}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div {...fadeIn}>
                <Card className="border-2 border-blue-100 dark:border-blue-900/30 dark:bg-gray-900 h-full">
                  <CardContent className="p-8">
                    <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.ourMission}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t.ourMissionText}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                <Card className="border-2 border-orange-100 dark:border-orange-900/30 dark:bg-gray-900 h-full">
                  <CardContent className="p-8">
                    <div className="h-12 w-12 rounded-lg bg-orange-600 flex items-center justify-center mb-4">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.ourVision}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t.ourVisionText}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2 {...fadeIn} className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">{t.ourImpact}</motion.h2>
            <div className="grid gap-8 md:grid-cols-4">
              {[
                { label: t.studentsAnnually, value: "2,000+" },
                { label: t.goethPassRate, value: "95%" },
                { label: t.expertInstructorsCount, value: "25+" },
                { label: t.yearsOfExcellence, value: "10" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors dark:bg-gray-900 dark:border-gray-800">
                    <CardContent className="p-6">
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.value}</div>
                      <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <motion.h2 {...fadeIn} className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">{t.whyChooseUs}</motion.h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                { icon: Award, title: t.goetheCertified, desc: t.goetheCertifiedText },
                { icon: Users, title: t.expertNativeInstructors, desc: t.expertNativeInstructorsText },
                { icon: GraduationCap, title: t.studyAbroadSupport, desc: t.studyAbroadSupportText },
                { icon: Globe, title: t.culturalImmersion, desc: t.culturalImmersionText },
                { title: t.completeCEFRPathway, desc: t.completeCEFRPathwayText, badge: "A1-C2" },
                { title: t.modernFacilities, desc: t.modernFacilitiesText, emoji: "📚" },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full dark:bg-gray-900 dark:border-gray-800">
                    <CardContent className="p-6">
                      {item.icon && <item.icon className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />}
                      {item.badge && (
                        <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                          <span className="text-white font-bold text-xs">{item.badge}</span>
                        </div>
                      )}
                      {item.emoji && (
                        <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                          <span className="text-white font-bold">{item.emoji}</span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-24 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-24 right-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight"
              >
                Meet Our Dedicated Team
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium"
              >
                Our team of certified professionals is committed to providing the highest quality German language education in Ethiopia.
              </motion.p>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {[
                {
                  name: "Dr. Dawit Abraham",
                  role: "Principal & Founder",
                  image: "/staff/founder.png",
                  bio: "PhD in Linguistics with 15+ years of experience in German education.",
                  color: "blue"
                },
                {
                  name: "Selamawit Tesfaye",
                  role: "Senior German Instructor",
                  image: "/staff/instructor1.png",
                  bio: "Certified Goethe-Institut examiner specializing in B2-C1 levels.",
                  color: "indigo"
                },
                {
                  name: "Yohannes Gebre",
                  role: "German Language Expert",
                  image: "/staff/instructor2.png",
                  bio: "Expert in TestDaF preparation and academic German.",
                  color: "orange"
                },
                {
                  name: "Bethlehem Tadesse",
                  role: "A1-B1 Specialist",
                  image: "/staff/instructor3.png",
                  bio: "Passionate about foundational German and cultural immersion.",
                  color: "purple"
                },
                {
                  name: "Tigist Mulugeta",
                  role: "Student Relations",
                  image: "/staff/receptionist.png",
                  bio: "Ensuring a smooth and supportive journey for every student.",
                  color: "green"
                }
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-gray-900 aspect-[3/4] mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 border-4 border-white dark:border-gray-800 group-hover:border-blue-500/20">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                      <p className="text-white text-sm font-medium leading-relaxed mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {member.bio}
                      </p>
                      <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                        <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                          <Globe className="h-4 w-4 text-white" />
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      {member.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2 {...fadeIn} className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">{t.ourPartners}</motion.h2>
            <motion.p {...fadeIn} transition={{ delay: 0.1 }} className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              {t.ourPartnersSubtitle}
            </motion.p>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {[
                { name: "Goethe-Institut", sub: t.officialExamCenter },
                { name: "DAAD", sub: t.studyAdvisor },
                { name: "German Embassy Addis", sub: t.culturalPartner },
                { name: "TestDaF Institute", sub: t.testPrep },
              ].map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="font-semibold text-gray-700 dark:text-gray-300">{partner.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{partner.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

