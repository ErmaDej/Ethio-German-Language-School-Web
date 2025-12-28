import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/cron/cancel-unpaid-enrollments
 * Cancel enrollments that are past their payment timeout
 * This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
 * 
 * Security: Add a secret token to prevent unauthorized access
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Call the database function to cancel unpaid enrollments
    const { data, error } = await supabase.rpc('cancel_unpaid_enrollments')

    if (error) {
      console.error('Error cancelling unpaid enrollments:', error)
      return NextResponse.json(
        { error: 'Failed to cancel unpaid enrollments', details: error.message },
        { status: 500 }
      )
    }

    const cancelledCount = data || 0

    return NextResponse.json({
      success: true,
      message: `Cancelled ${cancelledCount} unpaid enrollment(s)`,
      cancelledCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Allow GET for manual testing (remove in production or add auth)
export async function GET() {
  return NextResponse.json({
    message: 'Cancel unpaid enrollments endpoint',
    usage: 'POST to this endpoint to cancel unpaid enrollments',
    note: 'This endpoint should be called by a cron job',
  })
}

