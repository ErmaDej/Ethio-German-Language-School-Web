-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Admins and instructors can manage schedules" ON public.course_schedules;
DROP POLICY IF EXISTS "Instructors can view enrollments for their courses" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can manage waitlist" ON public.waitlist;

-- Fix profiles policies to avoid infinite recursion by using auth.jwt() instead of querying profiles table

-- Admins can view all profiles (using JWT claims instead of table lookup)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    (auth.jwt()->>'role')::text = 'admin'
    OR auth.uid() = id
  );

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    (auth.jwt()->>'role')::text = 'admin'
    OR auth.uid() = id
  );

-- Instructors can view basic profile info
CREATE POLICY "Instructors can view profiles"
  ON public.profiles FOR SELECT
  USING (
    (auth.jwt()->>'role')::text IN ('admin', 'instructor')
    OR auth.uid() = id
  );

-- Fix courses policies to avoid recursion

-- Admins can manage courses
CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (
    (auth.jwt()->>'role')::text = 'admin'
  );

-- Fix course_schedules policies

-- Admins and instructors can manage schedules
CREATE POLICY "Admins and instructors can manage schedules"
  ON public.course_schedules FOR ALL
  USING (
    (auth.jwt()->>'role')::text IN ('admin', 'instructor')
  );

-- Fix enrollments policies

-- Instructors can view enrollments for their courses
CREATE POLICY "Instructors can view enrollments for their courses"
  ON public.enrollments FOR SELECT
  USING (
    (auth.jwt()->>'role')::text IN ('admin', 'instructor')
    OR auth.uid() = student_id
  );

-- Admins can manage all enrollments
CREATE POLICY "Admins can manage all enrollments"
  ON public.enrollments FOR ALL
  USING (
    (auth.jwt()->>'role')::text = 'admin'
  );

-- Fix waitlist policies

-- Admins can manage waitlist
CREATE POLICY "Admins can manage waitlist"
  ON public.waitlist FOR ALL
  USING (
    (auth.jwt()->>'role')::text = 'admin'
  );

-- Create a function to set user role in JWT claims after profile creation
CREATE OR REPLACE FUNCTION public.handle_user_role_jwt()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the user's JWT claims with their role
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role::text)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update JWT claims when profile role changes
DROP TRIGGER IF EXISTS on_profile_role_change ON public.profiles;

CREATE TRIGGER on_profile_role_change
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_role_jwt();
