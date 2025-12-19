-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID NOT NULL REFERENCES public.course_schedules(id) ON DELETE CASCADE,
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  max_score INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create assignment submissions table
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT,
  attachment_url TEXT,
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ,
  UNIQUE(assignment_id, student_id)
);

-- Create course resources table
CREATE TABLE IF NOT EXISTS public.course_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID NOT NULL REFERENCES public.course_schedules(id) ON DELETE CASCADE,
  title JSONB NOT NULL,
  description JSONB,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('document', 'video', 'audio', 'link', 'other')),
  resource_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assignments
CREATE POLICY "Students can view assignments for enrolled courses"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.schedule_id = assignments.schedule_id
      AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can manage assignments for their courses"
  ON public.assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.course_schedules cs
      WHERE cs.id = assignments.schedule_id
      AND cs.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all assignments"
  ON public.assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for assignment_submissions
CREATE POLICY "Students can view their own submissions"
  ON public.assignment_submissions FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own submissions"
  ON public.assignment_submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own submissions"
  ON public.assignment_submissions FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Instructors can view and grade submissions for their courses"
  ON public.assignment_submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.course_schedules cs ON cs.id = a.schedule_id
      WHERE a.id = assignment_submissions.assignment_id
      AND cs.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all submissions"
  ON public.assignment_submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for course_resources
CREATE POLICY "Students can view resources for enrolled courses"
  ON public.course_resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.schedule_id = course_resources.schedule_id
      AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can manage resources for their courses"
  ON public.course_resources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.course_schedules cs
      WHERE cs.id = course_resources.schedule_id
      AND cs.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all resources"
  ON public.course_resources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
