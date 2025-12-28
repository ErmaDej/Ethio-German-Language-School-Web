-- Payment Integration Migration Script
-- This script adds payment support using Chapa payment gateway
-- Run this in your Supabase SQL Editor

-- Step 1: Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  chapa_tx_ref TEXT NOT NULL UNIQUE,
  amount_etb DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
  chapa_response JSONB,
  payment_url TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Update courses table - Rename price_usd to price_etb
-- First, add the new column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'courses' 
    AND column_name = 'price_etb'
  ) THEN
    -- Add new column
    ALTER TABLE public.courses ADD COLUMN price_etb DECIMAL(10,2);
    
    -- Migrate existing data: Convert USD to ETB (using approximate rate of 1 USD = 55 ETB)
    -- NOTE: Update this conversion rate based on current exchange rate or manually update prices
    UPDATE public.courses 
    SET price_etb = ROUND(price_usd * 55, 2)
    WHERE price_etb IS NULL;
    
    -- Make price_etb NOT NULL after migration
    ALTER TABLE public.courses ALTER COLUMN price_etb SET NOT NULL;
    
    -- Drop old column (commented out for safety - uncomment after verifying migration)
    -- ALTER TABLE public.courses DROP COLUMN price_usd;
  END IF;
END $$;

-- Step 3: Update enrollments table
-- Add payment_timeout column
ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS payment_timeout TIMESTAMPTZ;

-- Add payment_id column
ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL;

-- Step 4: Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Step 5: RLS Policies for payments
-- Students can view their own payments
CREATE POLICY "Students can view their own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = payments.enrollment_id
      AND e.student_id = auth.uid()
    )
  );

-- Students can create payments for their enrollments
CREATE POLICY "Students can create payments for their enrollments"
  ON public.payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = payments.enrollment_id
      AND e.student_id = auth.uid()
    )
  );

-- Students can update their own payments (for status updates)
CREATE POLICY "Students can update their own payments"
  ON public.payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = payments.enrollment_id
      AND e.student_id = auth.uid()
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can manage all payments
CREATE POLICY "Admins can manage all payments"
  ON public.payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service role can manage payments (for webhook handler)
-- This policy allows service role to update payments via webhooks
-- Note: Service role bypasses RLS, but this policy is for documentation
CREATE POLICY "Service role can manage payments"
  ON public.payments FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 6: Create trigger for payments updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Create index on chapa_tx_ref for fast lookups
CREATE INDEX IF NOT EXISTS idx_payments_chapa_tx_ref ON public.payments(chapa_tx_ref);

-- Step 8: Create index on enrollment_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_payments_enrollment_id ON public.payments(enrollment_id);

-- Step 9: Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Step 10: Create function to cancel unpaid enrollments
CREATE OR REPLACE FUNCTION public.cancel_unpaid_enrollments()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cancelled_count INTEGER;
BEGIN
  -- Cancel enrollments that are pending payment and past timeout
  UPDATE public.enrollments
  SET 
    enrollment_status = 'cancelled',
    updated_at = NOW()
  WHERE 
    enrollment_status = 'pending'
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

-- Step 11: Create function to set payment timeout on enrollment creation
CREATE OR REPLACE FUNCTION public.set_payment_timeout()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Set payment timeout to 24 hours from enrollment if not already set
  IF NEW.payment_timeout IS NULL AND NEW.payment_status = 'pending' THEN
    NEW.payment_timeout := NOW() + INTERVAL '24 hours';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 12: Create trigger to auto-set payment timeout
DROP TRIGGER IF EXISTS trigger_set_payment_timeout ON public.enrollments;
CREATE TRIGGER trigger_set_payment_timeout
  BEFORE INSERT ON public.enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_payment_timeout();

-- Step 13: Create function to update enrollment on successful payment
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
    AND enrollment_status = 'pending';
    
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

-- Step 14: Create trigger to auto-update enrollment on payment success
DROP TRIGGER IF EXISTS trigger_update_enrollment_on_payment ON public.payments;
CREATE TRIGGER trigger_update_enrollment_on_payment
  AFTER UPDATE OF status ON public.payments
  FOR EACH ROW
  WHEN (NEW.status = 'success' AND OLD.status != 'success')
  EXECUTE FUNCTION public.update_enrollment_on_payment();

-- Verification queries (run these to verify the migration)
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'payments';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses' AND column_name LIKE 'price%';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'enrollments' AND column_name LIKE 'payment%';

