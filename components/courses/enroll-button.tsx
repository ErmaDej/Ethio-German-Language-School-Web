"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"

export function EnrollButton({ scheduleId, availableSeats }: { scheduleId: string; availableSeats: number }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { language } = useLanguage()
  const t = translations[language]

  const handleEnroll = async () => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    // Check if user is logged in
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    try {
      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("student_id", user.id)
        .eq("schedule_id", scheduleId)
        .single()

      if (existingEnrollment) {
        setError(t.alreadyEnrolled)
        setIsLoading(false)
        return
      }

      // Create enrollment
      const { error: enrollError } = await supabase.from("enrollments").insert({
        student_id: user.id,
        schedule_id: scheduleId,
        enrollment_status: "pending",
        payment_status: "pending",
      })

      if (enrollError) throw enrollError

      // Redirect to student dashboard
      router.push("/student/enrollments")
    } catch (err) {
      console.error("Enrollment error:", err)
      setError(err instanceof Error ? err.message : t.failedToEnroll)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinWaitlist = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    try {
      // Get current waitlist position
      const { count } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true })
        .eq("schedule_id", scheduleId)

      const { error: waitlistError } = await supabase.from("waitlist").insert({
        student_id: user.id,
        schedule_id: scheduleId,
        position: (count || 0) + 1,
      })

      if (waitlistError) throw waitlistError

      router.push("/student/enrollments")
    } catch (err) {
      console.error("Waitlist error:", err)
      setError(err instanceof Error ? err.message : t.failedToJoinWaitlist)
    } finally {
      setIsLoading(false)
    }
  }

  if (availableSeats === 0) {
    return (
      <div className="w-full space-y-2">
        <Button
          onClick={handleJoinWaitlist}
          disabled={isLoading}
          variant="outline"
          className="w-full bg-transparent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.joining}
            </>
          ) : (
            t.joinWaitlist
          )}
        </Button>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <div className="w-full space-y-2">
      <Button
        onClick={handleEnroll}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t.enrolling}
          </>
        ) : (
          t.enrollNow
        )}
      </Button>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

