"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2, CreditCard } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface PaymentButtonProps {
  enrollmentId: string
  amount: number
  disabled?: boolean
  variant?: "default" | "outline" | "ghost"
  className?: string
}

export function PaymentButton({
  enrollmentId,
  amount,
  disabled = false,
  variant = "default",
  className,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { language } = useLanguage()
  const t = translations[language]
  const router = useRouter()

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enrollmentId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t.paymentError)
      }

      if (data.paymentUrl) {
        // Redirect to Chapa payment page
        window.location.href = data.paymentUrl
      } else {
        throw new Error(t.paymentError)
      }
    } catch (error) {
      console.error("Payment initialization error:", error)
      toast.error(
        error instanceof Error ? error.message : t.paymentError
      )
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      variant={variant}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t.paying}
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {t.payNow} ({amount.toLocaleString()} ETB)
        </>
      )}
    </Button>
  )
}

