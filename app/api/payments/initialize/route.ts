import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { initializePayment, generateTxRef } from '@/lib/services/chapa'

/**
 * POST /api/payments/initialize
 * Initialize a Chapa payment for an enrollment
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile and verify role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'student') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const { enrollmentId } = body

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      )
    }

    // Verify enrollment exists and belongs to user
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select(
        `
        *,
        schedule:course_schedules(
          *,
          course:courses(*)
        )
      `
      )
      .eq('id', enrollmentId)
      .eq('student_id', profile.id)
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    // Check if enrollment is already paid
    if (enrollment.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Enrollment is already paid' },
        { status: 400 }
      )
    }

    // Check if enrollment is cancelled
    if (enrollment.enrollment_status === 'cancelled') {
      return NextResponse.json(
        { error: 'Enrollment is cancelled' },
        { status: 400 }
      )
    }

    // Check if enrollment is approved by admin
    if (!enrollment.admin_approved || enrollment.enrollment_status !== 'admin_approved') {
      return NextResponse.json(
        { error: 'Enrollment must be approved by admin before payment' },
        { status: 400 }
      )
    }

    // Get course price
    const course = enrollment.schedule?.course
    if (!course || !course.price_etb) {
      return NextResponse.json(
        { error: 'Course price not found' },
        { status: 400 }
      )
    }

    const amount = parseFloat(course.price_etb)

    // Check if payment already exists
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .eq('status', 'pending')
      .single()

    let paymentId: string
    let txRef: string

    if (existingPayment) {
      // Use existing payment if it's still pending
      paymentId = existingPayment.id
      txRef = existingPayment.chapa_tx_ref
    } else {
      // Generate transaction reference
      txRef = generateTxRef(enrollmentId)

      // Get user profile for payment details
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', profile.id)
        .single()

      if (!userProfile) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        )
      }

      // Split full name into first and last name
      const nameParts = (userProfile.full_name || 'Student').split(' ')
      const firstName = nameParts[0] || 'Student'
      const lastName = nameParts.slice(1).join(' ') || 'User'

      // Get base URL for callbacks
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
        request.headers.get('origin') || 
        'http://localhost:3000'

      // Initialize payment with Chapa
      const { paymentUrl } = await initializePayment({
        amount,
        currency: 'ETB',
        email: userProfile.email || profile.email,
        first_name: firstName,
        last_name: lastName,
        phone_number: userProfile.phone || undefined,
        tx_ref: txRef,
        callback_url: `${baseUrl}/api/webhooks/chapa`,
        return_url: `${baseUrl}/student/enrollments?payment=success`,
        customization: {
          title: 'EthioGerman Language School',
          description: `Payment for ${course.title?.en || 'Course Enrollment'}`,
        },
      })

      // Create payment record in database
      const { data: newPayment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          enrollment_id: enrollmentId,
          chapa_tx_ref: txRef,
          amount_etb: amount,
          status: 'pending',
          payment_url: paymentUrl,
          chapa_response: { initialized: true },
        })
        .select()
        .single()

      if (paymentError || !newPayment) {
        console.error('Error creating payment record:', paymentError)
        return NextResponse.json(
          { error: 'Failed to create payment record' },
          { status: 500 }
        )
      }

      paymentId = newPayment.id

      // Update enrollment with payment_id and ensure payment_timeout is set
      const paymentTimeoutHours = parseInt(
        process.env.PAYMENT_TIMEOUT_HOURS || '24',
        10
      )
      const paymentTimeout = new Date()
      paymentTimeout.setHours(paymentTimeout.getHours() + paymentTimeoutHours)

      await supabase
        .from('enrollments')
        .update({
          payment_id: paymentId,
          payment_timeout: paymentTimeout.toISOString(),
        })
        .eq('id', enrollmentId)
    }

    // Get the payment record with updated info
    const { data: payment } = await supabase
      .from('payments')
      .select('payment_url')
      .eq('id', paymentId)
      .single()

    return NextResponse.json({
      success: true,
      paymentId,
      paymentUrl: payment?.payment_url,
      txRef,
    })
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to initialize payment',
      },
      { status: 500 }
    )
  }
}

