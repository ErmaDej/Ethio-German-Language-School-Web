"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"

export default function FAQPage() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 dark:text-white">{t.faqs || "Frequently Asked Questions"}</h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 dark:text-gray-400">
              {t.haveQuestionsText || "This page is under construction. Please contact us for any questions."}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

