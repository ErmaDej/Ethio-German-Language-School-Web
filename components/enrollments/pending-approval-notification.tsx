"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"

interface PendingApprovalNotificationProps {
  enrollment: {
    admin_approved: boolean
    enrollment_status: string
  }
}

export function PendingApprovalNotification({ enrollment }: PendingApprovalNotificationProps) {
  const { language } = useLanguage()
  const t = translations[language]

  // Show notification if enrollment is pending admin approval
  if (enrollment.enrollment_status === "pending" && !enrollment.admin_approved) {
    return (
      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          {t.enrollmentPendingApproval}
        </AlertDescription>
      </Alert>
    )
  }

  // Show success notification if admin approved
  if (enrollment.admin_approved && enrollment.enrollment_status === "admin_approved") {
    return (
      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-800 dark:text-green-300">
          {t.enrollmentApproved}
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

