-- Fix RLS Policies for Courses Table
-- This script ensures that anonymous users can view active courses
-- Run this in your Supabase SQL Editor

-- First, check if RLS is enabled
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

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Anyone can view active courses" ON public.courses;
DROP POLICY IF EXISTS "Public can view active courses" ON public.courses;
DROP POLICY IF EXISTS "Anonymous users can view active courses" ON public.courses;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.courses;

-- Create a policy that explicitly allows anonymous/public access to active courses
-- Using 'anon' and 'authenticated' roles explicitly ensures anonymous users can access
CREATE POLICY "Enable read access for all users"
  ON public.courses FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Verify the policy allows anonymous access
-- The policy above uses TO public which includes anonymous users

-- Also ensure admins can manage courses (if not already exists)
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;

CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Verify policies are created
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

-- Test query to verify anonymous access works
-- This should return active courses even without authentication
-- You can test this in Supabase SQL Editor while logged out
-- SELECT * FROM public.courses WHERE is_active = true LIMIT 5;

