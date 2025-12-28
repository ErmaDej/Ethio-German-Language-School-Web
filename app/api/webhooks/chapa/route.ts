import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyPayment, verifyWebhookSignature } from '@/lib/services/chapa'

/**
 * POST /api/webhooks/chapa
 * Handle Chapa payment webhook callbacks
 * This endpoint is public but should verify webhook signatures
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text()
    const payload = JSON.parse(body)

    // Verify webhook signature (if Chapa provides it)
    const signature = request.headers.get('x-chapa-signature') || 
                     request.headers.get('chapa-signature') ||
                     ''
    
    // Verify signature if provided
    if (signature) {
      const isValid = verifyWebhookSignature(body, signature)
      if (!isValid) {
        console.error('Invalid webhook signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    // Extract transaction reference from webhook payload
    // Chapa webhook format may vary - adjust based on actual payload structure
    const txRef = payload.tx_ref || payload.data?.tx_ref || payload.reference

    if (!txRef) {
      console.error('No transaction reference in webhook payload:', payload)
      return NextResponse.json(
        { error: 'Missing transaction reference' },
        { status: 400 }
      )
    }

    // Use service role client for webhook processing
    // Note: In Supabase, you may need to use service role key for this
    const supabase = await createClient()

    // Find payment by transaction reference
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, enrollment:enrollments(*)')
      .eq('chapa_tx_ref', txRef)
      .single()

    if (paymentError || !payment) {
      console.error('Payment not found for tx_ref:', txRef, paymentError)
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Verify payment status with Chapa API
    try {
      const verification = await verifyPayment(txRef)
      
      // Determine payment status
      let paymentStatus: 'pending' | 'success' | 'failed' | 'cancelled' = 'pending'
      
      if (verification.status === 'success') {
        paymentStatus = 'success'
      } else if (verification.status === 'failed') {
        paymentStatus = 'failed'
      }

      // Update payment record
      const updateData: any = {
        status: paymentStatus,
        chapa_response: {
          ...payment.chapa_response,
          webhook: payload,
          verification,
          verified_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      }

      if (paymentStatus === 'success') {
        updateData.paid_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', payment.id)

      if (updateError) {
        console.error('Error updating payment:', updateError)
        // Don't return error - webhook should return 200 to Chapa
      }

      // If payment is successful, the database trigger will handle enrollment update
      // But we can also manually verify and update if needed
      if (paymentStatus === 'success' && payment.enrollment) {
        const enrollment = payment.enrollment as any

        // Double-check enrollment status
        if (enrollment.enrollment_status === 'pending' && enrollment.payment_status === 'pending') {
          await supabase
            .from('enrollments')
            .update({
              enrollment_status: 'confirmed',
              payment_status: 'paid',
            })
            .eq('id', enrollment.id)

          // Decrement available seats
          await supabase.rpc('decrement_available_seats', {
            schedule_id: enrollment.schedule_id,
          }).catch(() => {
            // Fallback: manual update if RPC doesn't exist
            supabase
              .from('course_schedules')
              .select('available_seats')
              .eq('id', enrollment.schedule_id)
              .single()
              .then(({ data: schedule }) => {
                if (schedule) {
                  supabase
                    .from('course_schedules')
                    .update({
                      available_seats: Math.max(0, (schedule.available_seats || 0) - 1),
                    })
                    .eq('id', enrollment.schedule_id)
                }
              })
          })
        }
      }

      // Return success to Chapa
      return NextResponse.json({ 
        status: 'success',
        message: 'Webhook processed',
        tx_ref: txRef,
      })
    } catch (verifyError) {
      console.error('Error verifying payment:', verifyError)
      
      // Still update payment with webhook payload even if verification fails
      await supabase
        .from('payments')
        .update({
          chapa_response: {
            ...payment.chapa_response,
            webhook: payload,
            verification_error: verifyError instanceof Error ? verifyError.message : 'Unknown error',
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.id)

      // Return 200 to Chapa to prevent retries for verification errors
      // But log the error for investigation
      return NextResponse.json({
        status: 'received',
        message: 'Webhook received but verification failed',
        tx_ref: txRef,
      })
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    
    // Return 200 to Chapa to prevent infinite retries
    // But log the error for investigation
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    )
  }
}

// Allow GET for webhook verification (if Chapa requires it)
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Chapa webhook endpoint' })
}

