-- ============================================================
-- Migration: lessons_schedule
-- Creates lessons and lesson_enrollments tables with RLS,
-- indexes, and realtime support.
-- Idempotent: safe to run multiple times.
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLES
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lessons (
  id           uuid         DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id    uuid         NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        text         NOT NULL,
  subject      text         NOT NULL DEFAULT 'General',
  description  text         NOT NULL DEFAULT '',
  lesson_date  date         NOT NULL,
  start_time   time         NOT NULL,
  end_time     time         NOT NULL,
  max_students int          NOT NULL DEFAULT 5,
  meeting_link text         NOT NULL DEFAULT '',
  status       text         NOT NULL DEFAULT 'scheduled'
                              CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at   timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lesson_enrollments (
  id          uuid         DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id   uuid         NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  student_id  uuid         NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      text         NOT NULL DEFAULT 'enrolled'
                             CHECK (status IN ('enrolled', 'completed', 'cancelled')),
  enrolled_at timestamptz  NOT NULL DEFAULT now(),
  UNIQUE(lesson_id, student_id)
);

-- ------------------------------------------------------------
-- 2. INDEXES
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_lessons_mentor_id
  ON public.lessons(mentor_id);

CREATE INDEX IF NOT EXISTS idx_lessons_date
  ON public.lessons(lesson_date);

CREATE INDEX IF NOT EXISTS idx_lesson_enrollments_lesson_id
  ON public.lesson_enrollments(lesson_id);

CREATE INDEX IF NOT EXISTS idx_lesson_enrollments_student_id
  ON public.lesson_enrollments(student_id);

-- ------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ------------------------------------------------------------

ALTER TABLE public.lessons           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_enrollments ENABLE ROW LEVEL SECURITY;

-- ---- lessons policies ----

DROP POLICY IF EXISTS lessons_select ON public.lessons;
DROP POLICY IF EXISTS lessons_insert ON public.lessons;
DROP POLICY IF EXISTS lessons_update ON public.lessons;
DROP POLICY IF EXISTS lessons_delete ON public.lessons;

CREATE POLICY lessons_select
  ON public.lessons
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY lessons_insert
  ON public.lessons
  FOR INSERT
  WITH CHECK (
    auth.uid() = mentor_id
    AND EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('mentor', 'admin')
    )
  );

CREATE POLICY lessons_update
  ON public.lessons
  FOR UPDATE
  USING (auth.uid() = mentor_id OR public.is_admin());

CREATE POLICY lessons_delete
  ON public.lessons
  FOR DELETE
  USING (auth.uid() = mentor_id OR public.is_admin());

-- ---- lesson_enrollments policies ----

DROP POLICY IF EXISTS enrollments_select ON public.lesson_enrollments;
DROP POLICY IF EXISTS enrollments_insert ON public.lesson_enrollments;
DROP POLICY IF EXISTS enrollments_update ON public.lesson_enrollments;
DROP POLICY IF EXISTS enrollments_delete ON public.lesson_enrollments;

CREATE POLICY enrollments_select
  ON public.lesson_enrollments
  FOR SELECT
  USING (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1
      FROM public.lessons l
      WHERE l.id = lesson_id
        AND l.mentor_id = auth.uid()
    )
    OR public.is_admin()
  );

CREATE POLICY enrollments_insert
  ON public.lesson_enrollments
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY enrollments_update
  ON public.lesson_enrollments
  FOR UPDATE
  USING (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1
      FROM public.lessons l
      WHERE l.id = lesson_id
        AND l.mentor_id = auth.uid()
    )
    OR public.is_admin()
  );

CREATE POLICY enrollments_delete
  ON public.lesson_enrollments
  FOR DELETE
  USING (auth.uid() = student_id);

-- ------------------------------------------------------------
-- 4. REALTIME
-- ------------------------------------------------------------

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.lessons;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.lesson_enrollments;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;
