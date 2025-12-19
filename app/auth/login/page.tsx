"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { language } = useLanguage()
  const t = translations[language]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      // Get user role to redirect accordingly
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const role = user?.user_metadata?.role || "student"

      if (role === "admin") {
        router.push("/admin")
      } else if (role === "instructor") {
        router.push("/instructor")
      } else {
        router.push("/student")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

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
            <CardTitle className="text-2xl dark:text-white">{t.loginTitle}</CardTitle>
            <CardDescription className="dark:text-gray-400">{t.loginSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="dark:text-gray-300">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400" role="alert">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white" disabled={isLoading}>
                  {isLoading ? t.signingIn : t.signInBtn}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm dark:text-gray-400">
                {t.dontHaveAccount}{" "}
                <Link href="/auth/sign-up" className="font-medium text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline">
                  {t.signUp}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

