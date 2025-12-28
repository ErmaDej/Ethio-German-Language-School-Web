import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyPayment } from '@/lib/services/chapa'

/**
 * GET /api/payments/verify/[txRef]
 * Manually verify a payment transaction
 * Useful for checking payment status or retry verification
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { txRef: string } }
) {
  try {
    const { txRef } = params

    if (!txRef) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      )
    }

    // Authenticate user (optional - can be public for status checks)
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Find payment
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, enrollment:enrollments(*)')
      .eq('chapa_tx_ref', txRef)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    // If user is authenticated, verify they own this payment
    if (user) {
      const enrollment = payment.enrollment as any
      if (enrollment && enrollment.student_id !== user.id) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'admin') {
          return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
          )
        }
      }
    }

    // Verify payment with Chapa
    const verification = await verifyPayment(txRef)

    // Update payment status if changed
    let paymentStatus: 'pending' | 'success' | 'failed' | 'cancelled' = payment.status
    
    if (verification.status === 'success' && payment.status !== 'success') {
      paymentStatus = 'success'
    } else if (verification.status === 'failed' && payment.status === 'pending') {
      paymentStatus = 'failed'
    }

    if (paymentStatus !== payment.status) {
      const updateData: any = {
        status: paymentStatus,
        chapa_response: {
          ...payment.chapa_response,
          verification,
          verified_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      }

      if (paymentStatus === 'success') {
        updateData.paid_at = new Date().toISOString()
      }

      await supabase
        .from('payments')
        .update(updateData)
        .eq('id', payment.id)
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: paymentStatus,
        amount: payment.amount_etb,
        txRef: payment.chapa_tx_ref,
        verification,
      },
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to verify payment',
      },
      { status: 500 }
    )
  }
}

