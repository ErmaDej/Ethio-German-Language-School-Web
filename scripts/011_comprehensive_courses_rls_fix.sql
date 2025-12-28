-- Comprehensive RLS Policy Fix for Courses Table
-- This script ensures anonymous users can view active courses
-- Run this in your Supabase SQL Editor

-- Step 1: Verify table exists and RLS is enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'courses'
  ) THEN
    RAISE EXCEPTION 'Courses table does not exist';
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies on courses table to start fresh
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'courses') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.courses', r.policyname);
  END LOOP;
END $$;

-- Step 3: Create a permissive policy for SELECT that allows anonymous access
-- This is the most permissive approach - allows anyone (including anonymous) to read active courses
CREATE POLICY "Public read access for active courses"
  ON public.courses
  FOR SELECT
  USING (is_active = true);

-- Step 4: Create policy for admins to manage courses
-- Using auth.jwt() to avoid recursion issues
CREATE POLICY "Admins can manage courses"
  ON public.courses
  FOR ALL
  USING (
    (auth.jwt()->>'role')::text = 'admin'
  )
  WITH CHECK (
    (auth.jwt()->>'role')::text = 'admin'
  );

-- Step 5: Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'courses'
ORDER BY policyname;

-- Step 6: Test the policy (uncomment to test)
-- This should work even when not authenticated
-- SELECT COUNT(*) FROM public.courses WHERE is_active = true;

-- Step 7: Grant necessary permissions (if needed)
-- Ensure the anon role has access to the table
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.courses TO anon, authenticated;

-- Note: If you still have issues, check:
-- 1. That RLS is enabled: SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'courses';
-- 2. That policies exist: SELECT * FROM pg_policies WHERE tablename = 'courses';
-- 3. Test with: SET ROLE anon; SELECT * FROM public.courses WHERE is_active = true LIMIT 1;

