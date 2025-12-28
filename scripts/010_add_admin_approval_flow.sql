-- Add Admin Approval Flow to Enrollments
-- This script adds fields to track admin approval before payment

-- Step 1: Add admin approval fields to enrollments table
ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS admin_approved BOOLEAN DEFAULT false;

ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS admin_approved_at TIMESTAMPTZ;

ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Step 2: Update enrollment status check constraint to include 'admin_approved'
-- First, drop the existing constraint
ALTER TABLE public.enrollments 
DROP CONSTRAINT IF EXISTS enrollments_enrollment_status_check;

-- Add new constraint with 'admin_approved' status
ALTER TABLE public.enrollments 
ADD CONSTRAINT enrollments_enrollment_status_check 
CHECK (enrollment_status IN ('pending', 'admin_approved', 'confirmed', 'cancelled', 'completed'));

-- Step 3: Update the payment timeout trigger to set timeout from admin_approved_at
-- Drop the old trigger
DROP TRIGGER IF EXISTS trigger_set_payment_timeout ON public.enrollments;

-- Create new function that sets payment timeout from admin approval
CREATE OR REPLACE FUNCTION public.set_payment_timeout()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Set payment timeout to 24 hours from admin approval (not enrollment)
  IF NEW.admin_approved = true AND OLD.admin_approved = false THEN
    -- Admin just approved, set payment timeout
    NEW.payment_timeout := NOW() + INTERVAL '24 hours';
  ELSIF NEW.admin_approved = true AND NEW.payment_timeout IS NULL THEN
    -- Admin approved but timeout not set (shouldn't happen, but safety check)
    NEW.payment_timeout := NOW() + INTERVAL '24 hours';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to set payment timeout when admin approves
CREATE TRIGGER trigger_set_payment_timeout
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW
  WHEN (NEW.admin_approved = true AND (OLD.admin_approved IS NULL OR OLD.admin_approved = false))
  EXECUTE FUNCTION public.set_payment_timeout();

-- Step 4: Update the auto-cancellation function to only cancel admin-approved enrollments
CREATE OR REPLACE FUNCTION public.cancel_unpaid_enrollments()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cancelled_count INTEGER;
BEGIN
  -- Cancel enrollments that are admin-approved, pending payment, and past timeout
  UPDATE public.enrollments
  SET 
    enrollment_status = 'cancelled',
    updated_at = NOW()
  WHERE 
    admin_approved = true
    AND enrollment_status = 'admin_approved'
    AND payment_status = 'pending'
    AND payment_timeout IS NOT NULL
    AND payment_timeout < NOW()
    AND id NOT IN (
      -- Exclude enrollments with successful payments
      SELECT DISTINCT enrollment_id 
      FROM public.payments 
      WHERE status = 'success'
    );
  
  GET DIAGNOSTICS cancelled_count = ROW_COUNT;
  
  RETURN cancelled_count;
END;
$$;

-- Step 5: Update the enrollment-on-payment-success trigger
-- The trigger should update status from 'admin_approved' to 'confirmed'
CREATE OR REPLACE FUNCTION public.update_enrollment_on_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- When payment status changes to 'success', update enrollment
  IF NEW.status = 'success' AND OLD.status != 'success' THEN
    UPDATE public.enrollments
    SET 
      enrollment_status = 'confirmed',
      payment_status = 'paid',
      payment_id = NEW.id,
      updated_at = NOW()
    WHERE id = NEW.enrollment_id
    AND enrollment_status = 'admin_approved';
    
    -- Decrement available seats in course schedule
    UPDATE public.course_schedules
    SET available_seats = GREATEST(0, available_seats - 1)
    WHERE id = (
      SELECT schedule_id 
      FROM public.enrollments 
      WHERE id = NEW.enrollment_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 6: Create index for faster queries on admin_approved
CREATE INDEX IF NOT EXISTS idx_enrollments_admin_approved 
ON public.enrollments(admin_approved) 
WHERE admin_approved = false AND enrollment_status = 'pending';

-- Step 7: Create view for pending admin approvals
CREATE OR REPLACE VIEW public.pending_admin_approvals_view AS
SELECT 
  e.id as enrollment_id,
  e.student_id,
  e.schedule_id,
  e.enrolled_at,
  p.full_name as student_name,
  p.email as student_email,
  c.title->>'en' as course_title,
  cs.start_date,
  cs.time_start,
  cs.time_end
FROM public.enrollments e
LEFT JOIN public.profiles p ON e.student_id = p.id
LEFT JOIN public.course_schedules cs ON e.schedule_id = cs.id
LEFT JOIN public.courses c ON cs.course_id = c.id
WHERE 
  e.enrollment_status = 'pending'
  AND e.admin_approved = false
ORDER BY e.enrolled_at ASC;

-- Verification queries
-- SELECT * FROM public.pending_admin_approvals_view;
-- SELECT COUNT(*) FROM public.enrollments WHERE admin_approved = false AND enrollment_status = 'pending';

