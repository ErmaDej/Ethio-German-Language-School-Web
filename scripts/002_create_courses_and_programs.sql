-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title JSONB NOT NULL, -- {en: "...", de: "...", am: "..."}
  description JSONB NOT NULL,
  short_description JSONB,
  level proficiency_level NOT NULL,
  language_taught language_code NOT NULL, -- Language being taught
  duration_weeks INTEGER NOT NULL,
  hours_per_week DECIMAL(4,2) NOT NULL,
  max_students INTEGER NOT NULL DEFAULT 15,
  price_usd DECIMAL(10,2) NOT NULL,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course schedules table
CREATE TABLE IF NOT EXISTS public.course_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_of_week INTEGER[] NOT NULL, -- [1,3,5] for Mon, Wed, Fri
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Africa/Addis_Ababa',
  available_seats INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  schedule_id UUID NOT NULL REFERENCES public.course_schedules(id) ON DELETE CASCADE,
  enrollment_status TEXT NOT NULL DEFAULT 'pending' CHECK (enrollment_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, schedule_id)
);

-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  schedule_id UUID NOT NULL REFERENCES public.course_schedules(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'enrolled', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, schedule_id)
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (public read)
CREATE POLICY "Anyone can view active courses"
  ON public.courses FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for course_schedules (public read)
CREATE POLICY "Anyone can view course schedules"
  ON public.course_schedules FOR SELECT
  USING (true);

CREATE POLICY "Admins and instructors can manage schedules"
  ON public.course_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'instructor')
    )
  );

-- RLS Policies for enrollments
CREATE POLICY "Students can view their own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own enrollments"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own enrollments"
  ON public.enrollments FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Instructors can view enrollments for their courses"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.course_schedules cs
      WHERE cs.id = enrollments.schedule_id
      AND cs.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all enrollments"
  ON public.enrollments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for waitlist
CREATE POLICY "Students can view their own waitlist entries"
  ON public.waitlist FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can join waitlist"
  ON public.waitlist FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can manage waitlist"
  ON public.waitlist FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_schedules_updated_at
  BEFORE UPDATE ON public.course_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_waitlist_updated_at
  BEFORE UPDATE ON public.waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
