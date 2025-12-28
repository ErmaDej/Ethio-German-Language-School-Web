-- Auto-Cancellation Function for Unpaid Enrollments
-- This function cancels enrollments that are past their payment timeout
-- Can be called via Supabase Edge Function, API route, or scheduled job

-- The function is already created in 008_add_payment_integration.sql
-- This script provides additional utilities and can be used for manual execution

-- Manual execution query (for testing):
-- SELECT public.cancel_unpaid_enrollments();

-- View enrollments that will be cancelled (for verification):
-- SELECT 
--   e.id,
--   e.student_id,
--   e.schedule_id,
--   e.enrollment_status,
--   e.payment_status,
--   e.payment_timeout,
--   NOW() as current_time,
--   (e.payment_timeout < NOW()) as is_expired
-- FROM public.enrollments e
-- WHERE 
--   e.enrollment_status = 'pending'
--   AND e.payment_status = 'pending'
--   AND e.payment_timeout IS NOT NULL
--   AND e.payment_timeout < NOW()
--   AND e.id NOT IN (
--     SELECT DISTINCT enrollment_id 
--     FROM public.payments 
--     WHERE status = 'success'
--   );

-- Create a view for monitoring unpaid enrollments
CREATE OR REPLACE VIEW public.unpaid_enrollments_view AS
SELECT 
  e.id as enrollment_id,
  e.student_id,
  e.schedule_id,
  e.enrollment_status,
  e.payment_status,
  e.payment_timeout,
  NOW() as current_time,
  EXTRACT(EPOCH FROM (e.payment_timeout - NOW())) / 3600 as hours_until_expiry,
  CASE 
    WHEN e.payment_timeout < NOW() THEN 'expired'
    WHEN e.payment_timeout < NOW() + INTERVAL '1 hour' THEN 'expiring_soon'
    ELSE 'active'
  END as expiry_status,
  p.id as payment_id,
  p.status as payment_status_detail,
  c.title->>'en' as course_title,
  cs.start_date
FROM public.enrollments e
LEFT JOIN public.payments p ON e.payment_id = p.id
LEFT JOIN public.course_schedules cs ON e.schedule_id = cs.id
LEFT JOIN public.courses c ON cs.course_id = c.id
WHERE 
  e.enrollment_status = 'pending'
  AND e.payment_status = 'pending'
  AND e.payment_timeout IS NOT NULL;

-- Grant access to view for authenticated users (students can see their own, admins can see all)
-- Note: RLS will handle access control

-- Create index for faster queries on payment_timeout
CREATE INDEX IF NOT EXISTS idx_enrollments_payment_timeout 
ON public.enrollments(payment_timeout) 
WHERE enrollment_status = 'pending' AND payment_status = 'pending';

