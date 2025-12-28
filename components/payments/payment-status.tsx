"use client"

import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { formatDistanceToNow } from "date-fns"
import { PaymentButton } from "./payment-button"

interface PaymentStatusProps {
  enrollment: {
    id: string
    payment_status: string
    enrollment_status: string
    admin_approved?: boolean
    payment_timeout?: string
    schedule?: {
      course?: {
        price_etb: number
      }
    }
  }
  showButton?: boolean
}

export function PaymentStatus({ enrollment, showButton = true }: PaymentStatusProps) {
  const { language } = useLanguage()
  const t = translations[language]

  const getStatusConfig = () => {
    switch (enrollment.payment_status) {
      case "paid":
        return {
          icon: CheckCircle2,
          color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          label: t.paymentSuccess,
          message: t.paymentCompleted,
        }
      case "pending":
        return {
          icon: Clock,
          color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
          label: t.paymentPending,
          message: t.pleaseCompletePayment,
        }
      case "failed":
      case "cancelled":
        return {
          icon: XCircle,
          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          label: enrollment.payment_status === "failed" ? t.paymentFailed : t.paymentCancelled,
          message: enrollment.payment_status === "failed" 
            ? t.paymentError 
            : t.paymentCancelled,
        }
      default:
        return {
          icon: AlertCircle,
          color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
          label: t.paymentPending,
          message: t.paymentRequired,
        }
    }
  }

  const statusConfig = getStatusConfig()
  const Icon = statusConfig.icon
  const amount = enrollment.schedule?.course?.price_etb || 0

  // Calculate time until expiration
  const getTimeUntilExpiration = () => {
    if (!enrollment.payment_timeout || enrollment.payment_status === "paid") {
      return null
    }

    try {
      const timeoutDate = new Date(enrollment.payment_timeout)
      const now = new Date()

      if (timeoutDate < now) {
        return t.paymentExpired
      }

      return formatDistanceToNow(timeoutDate, { addSuffix: true })
    } catch {
      return null
    }
  }

  const timeUntilExpiration = getTimeUntilExpiration()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
        </div>
        {enrollment.payment_status === "pending" && timeUntilExpiration && (
          <span className="text-xs text-muted-foreground">
            {t.paymentExpiresIn}: {timeUntilExpiration}
          </span>
        )}
      </div>

      {enrollment.payment_status === "pending" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {statusConfig.message}
            {timeUntilExpiration && (
              <span className="block mt-1 text-xs">
                {t.paymentWillExpire}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Only show payment button if admin has approved */}
      {showButton && 
       enrollment.payment_status === "pending" && 
       enrollment.admin_approved === true && (
        <PaymentButton
          enrollmentId={enrollment.id}
          amount={amount}
          className="w-full"
        />
      )}

      {enrollment.payment_status === "failed" && 
       showButton && 
       enrollment.admin_approved === true && (
        <PaymentButton
          enrollmentId={enrollment.id}
          amount={amount}
          variant="outline"
          className="w-full"
        />
      )}
    </div>
  )
}

