"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export default function VerifyPage() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 p-6 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{t.schoolName}</h1>
            <p className="text-muted-foreground uppercase tracking-widest text-xs font-medium mt-1">{t.schoolSubtitle}</p>
          </Link>
        </div>
        <Card className="dark:bg-gray-900 dark:border-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">{t.checkYourEmail}</CardTitle>
            <CardDescription className="dark:text-gray-400">{t.verificationSent}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
              {t.verificationInstructions}
            </p>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              {t.checkSpam}
            </p>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
              <Link href="/auth/login">{t.returnToLogin}</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

