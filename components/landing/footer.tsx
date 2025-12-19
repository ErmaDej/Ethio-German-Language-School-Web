"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { useEffect, useState } from "react"

export function Footer() {
  const { language } = useLanguage()
  const t = translations[language]
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const footerLinks = {
    courses: [
      { name: t.onlineCourses, href: "/courses?delivery=online" },
      { name: t.onsiteCourses, href: "/courses?delivery=onsite" },
      { name: t.oneToOneTutoring, href: "/courses?delivery=one-to-one" },
      { name: t.allCourses, href: "/courses" },
    ],
    company: [
      { name: t.aboutUs, href: "/about" },
      { name: t.contact, href: "/contact" },
      { name: t.faqs, href: "/faq" },
    ],
    support: [
      { name: t.helpCenter, href: "/help" },
      { name: t.studentPortal, href: "/student" },
      { name: t.instructorPortal, href: "/instructor" },
    ],
    legal: [
      { name: t.privacyPolicy, href: "/privacy" },
      { name: t.termsOfService, href: "/terms" },
    ],
  }

  if (!mounted) {
    return (
      <footer className="bg-gray-900 dark:bg-black text-gray-300 h-[400px]">
        <div className="container mx-auto px-4 py-12">
          <div className="h-10 w-48 animate-pulse bg-gray-800 rounded mb-4" />
          <div className="h-20 w-full max-w-sm animate-pulse bg-gray-800 rounded mb-6" />
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 transition-colors duration-500 border-t border-gray-800 dark:border-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                EG
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black leading-none text-white tracking-tight">{t.schoolName}</span>
                <span className="text-[10px] text-gray-400 leading-none mt-1.5 uppercase tracking-widest font-bold">{t.schoolSubtitle}</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-sm text-base font-medium">
              {t.footerDescription}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-all p-3 rounded-xl bg-gray-800/50 hover:bg-blue-600 hover:-translate-y-1 shadow-lg"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t.courses}</h3>
            <ul className="space-y-4">
              {footerLinks.courses.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-blue-400 transition-colors text-sm font-semibold">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t.company}</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-blue-400 transition-colors text-sm font-semibold">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t.contact}</h3>
            <ul className="space-y-5">
              <li className="flex items-center gap-3 text-sm font-medium">
                <div className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <a href="mailto:info@ethiogerman.com" className="hover:text-white transition-colors">
                  info@ethiogerman.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <div className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <a href="tel:+251911234567" className="hover:text-white transition-colors">
                  +251 911 234 567
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm font-medium">
                <div className="h-9 w-9 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <span className="leading-relaxed">Bole, Addis Ababa, Ethiopia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} {t.schoolName}. {t.allRightsReserved}
          </p>
          <div className="flex gap-8">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-gray-500 hover:text-white transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}


