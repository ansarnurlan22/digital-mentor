-- ==============================================================================
-- DIGITAL MENTOR: ПОЛНЫЙ PRODUCTION-READY SQL СКРИПТ
-- Применять в: Supabase Dashboard → SQL Editor
-- Версия: 2026-09-30 (v3.0 — добавлены courses, onboarding, admin lock)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. ENUM TYPES (idempotent)
-- ------------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('student', 'mentor', 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
    CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (с полями онбординга)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id                   UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name            TEXT NOT NULL DEFAULT '',
  grade                TEXT NOT NULL DEFAULT '',
  role                 public.user_role NOT NULL DEFAULT 'student',
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_url           TEXT,
  xp                   INT NOT NULL DEFAULT 0,
  streak_days          INT NOT NULL DEFAULT 0,
  volunteer_minutes    INT NOT NULL DEFAULT 0,
  mentor_rating        NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Добавляем недостающие столбцы если таблица уже существует
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='grade') THEN
    ALTER TABLE public.profiles ADD COLUMN grade TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='onboarding_completed') THEN
    ALTER TABLE public.profiles ADD COLUMN onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. COURSES TABLE (для менторов и админов)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT 'Другое',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Индекс для быстрого поиска курсов ментора
CREATE INDEX IF NOT EXISTS idx_courses_mentor_id ON public.courses(mentor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);

-- ------------------------------------------------------------------------------
-- 3. MODULES & SKILL NODES (учебные материалы)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.modules (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  order_index INT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skill_nodes (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id          UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title              TEXT NOT NULL,
  node_type          TEXT CHECK (node_type IN ('interactive_step', 'capstone_boss')) NOT NULL,
  order_index        INT NOT NULL,
  problem_statement  TEXT,
  initial_code       TEXT,
  expected_solution  TEXT,
  ai_rubric          JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. MICRO-TICKETS (70/30 Hybrid Engine)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.micro_tickets (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mentor_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  node_id        UUID REFERENCES public.skill_nodes(id) ON DELETE CASCADE NOT NULL,
  status         public.ticket_status NOT NULL DEFAULT 'open',
  code_context   TEXT,
  student_query  TEXT NOT NULL,
  mentor_answer  TEXT,
  ai_summary     TEXT,
  awarded_minutes INT NOT NULL DEFAULT 15,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at    TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 5. CERTIFICATES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  verification_token TEXT UNIQUE NOT NULL,
  total_hours        NUMERIC(5, 2) NOT NULL,
  issued_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_role        ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_micro_tickets_status  ON public.micro_tickets(status);
CREATE INDEX IF NOT EXISTS idx_micro_tickets_student ON public.micro_tickets(student_id);
CREATE INDEX IF NOT EXISTS idx_micro_tickets_mentor  ON public.micro_tickets(mentor_id);
CREATE INDEX IF NOT EXISTS idx_certificates_token   ON public.certificates(verification_token);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY — ВКЛЮЧАЕМ
-- ==============================================================================
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_nodes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates  ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 8. HELPER: is_admin() — избегаем рекурсии в RLS политиках
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  OR (
    SELECT lower(email) = 'ansarnurlan2@gmail.com'
    FROM auth.users
    WHERE id = auth.uid()
  );
$$;

-- ==============================================================================
-- 9. PROFILES RLS POLICIES
-- ==============================================================================

-- Сброс старых политик
DROP POLICY IF EXISTS "Allow read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile once" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their profile except role" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;

-- SELECT: любой авторизованный видит все профили (для отображения имён менторов)
CREATE POLICY "profiles_select"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- INSERT: только сам пользователь создаёт свой профиль
CREATE POLICY "profiles_insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: сам себя или admin
CREATE POLICY "profiles_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

-- ALL (DELETE и прочее): только admin
CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- ==============================================================================
-- 10. COURSES RLS POLICIES
-- ==============================================================================

DROP POLICY IF EXISTS "courses_select" ON public.courses;
DROP POLICY IF EXISTS "courses_insert" ON public.courses;
DROP POLICY IF EXISTS "courses_update" ON public.courses;
DROP POLICY IF EXISTS "courses_delete" ON public.courses;

-- SELECT: все авторизованные пользователи видят курсы
CREATE POLICY "courses_select"
  ON public.courses FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- INSERT: только mentor или admin
CREATE POLICY "courses_insert"
  ON public.courses FOR INSERT
  WITH CHECK (
    auth.uid() = mentor_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('mentor', 'admin')
    )
  );

-- UPDATE: только автор курса или admin
CREATE POLICY "courses_update"
  ON public.courses FOR UPDATE
  USING (
    auth.uid() = mentor_id
    OR public.is_admin()
  );

-- DELETE: только автор курса или admin
CREATE POLICY "courses_delete"
  ON public.courses FOR DELETE
  USING (
    auth.uid() = mentor_id
    OR public.is_admin()
  );

-- ==============================================================================
-- 11. MODULES & SKILL NODES RLS
-- ==============================================================================

DROP POLICY IF EXISTS "Allow read modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can modify curriculum" ON public.modules;
DROP POLICY IF EXISTS "Allow read skill_nodes" ON public.skill_nodes;
DROP POLICY IF EXISTS "Admins can modify skill nodes" ON public.skill_nodes;

CREATE POLICY "modules_select"   ON public.modules FOR SELECT USING (true);
CREATE POLICY "modules_admin"    ON public.modules FOR ALL    USING (public.is_admin());
CREATE POLICY "snodes_select"    ON public.skill_nodes FOR SELECT USING (true);
CREATE POLICY "snodes_admin"     ON public.skill_nodes FOR ALL    USING (public.is_admin());

-- ==============================================================================
-- 12. MICRO-TICKETS RLS
-- ==============================================================================

DROP POLICY IF EXISTS "Students can view own tickets" ON public.micro_tickets;
DROP POLICY IF EXISTS "Students can create micro_tickets" ON public.micro_tickets;
DROP POLICY IF EXISTS "Mentors and students can update their tickets" ON public.micro_tickets;

CREATE POLICY "tickets_select"
  ON public.micro_tickets FOR SELECT
  USING (
    auth.uid() = student_id
    OR auth.uid() = mentor_id
    OR public.is_admin()
  );

CREATE POLICY "tickets_insert"
  ON public.micro_tickets FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "tickets_update"
  ON public.micro_tickets FOR UPDATE
  USING (
    auth.uid() = student_id
    OR auth.uid() = mentor_id
    OR public.is_admin()
  );

-- ==============================================================================
-- 13. CERTIFICATES RLS
-- ==============================================================================

DROP POLICY IF EXISTS "Public verification of certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admins can manage certificates" ON public.certificates;

CREATE POLICY "certs_select" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "certs_admin"  ON public.certificates FOR ALL    USING (public.is_admin());

-- ==============================================================================
-- 14. TRIGGERS & FUNCTIONS
-- ==============================================================================

-- A. Auto-create profile on new auth.users (с определением admin для super-email)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    grade,
    avatar_url,
    role,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    '',
    NEW.raw_user_meta_data->>'avatar_url',
    CASE
      WHEN LOWER(NEW.email) = 'ansarnurlan2@gmail.com' THEN 'admin'::public.user_role
      ELSE 'student'::public.user_role
    END,
    CASE
      WHEN LOWER(NEW.email) = 'ansarnurlan2@gmail.com' THEN TRUE
      ELSE FALSE
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- B. updated_at автообновление для courses
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS courses_updated_at ON public.courses;
CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- C. Auto-award volunteer minutes when micro_ticket resolved
CREATE OR REPLACE FUNCTION public.handle_micro_ticket_resolution()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  v_total_hours NUMERIC(5, 2);
  v_token TEXT;
BEGIN
  IF (OLD.status IS DISTINCT FROM 'resolved' AND NEW.status = 'resolved' AND NEW.mentor_id IS NOT NULL) THEN
    UPDATE public.profiles
    SET volunteer_minutes = volunteer_minutes + COALESCE(NEW.awarded_minutes, 15)
    WHERE id = NEW.mentor_id;

    SELECT ROUND((volunteer_minutes / 60.0)::NUMERIC, 2)
    INTO v_total_hours
    FROM public.profiles
    WHERE id = NEW.mentor_id;

    v_token := 'DM-' || UPPER(SUBSTR(MD5(NEW.mentor_id::TEXT), 1, 8)) || '-' || TO_CHAR(NOW(), 'YYMM');

    INSERT INTO public.certificates (mentor_id, verification_token, total_hours, issued_at)
    VALUES (NEW.mentor_id, v_token, v_total_hours, NOW())
    ON CONFLICT (verification_token) DO UPDATE
    SET total_hours = EXCLUDED.total_hours, issued_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_micro_ticket_resolved ON public.micro_tickets;
CREATE TRIGGER on_micro_ticket_resolved
  AFTER UPDATE ON public.micro_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_micro_ticket_resolution();

-- ==============================================================================
-- 15. ADMIN LOCK: Принудительно выставляем admin для ansarnurlan2@gmail.com
-- ==============================================================================
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Ищем пользователя в auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE LOWER(email) = 'ansarnurlan2@gmail.com'
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    -- Upsert профиля с admin-правами
    INSERT INTO public.profiles (id, full_name, grade, role, onboarding_completed)
    VALUES (
      v_user_id,
      'Ansarnurlan Admin',
      'Admin',
      'admin',
      TRUE
    )
    ON CONFLICT (id) DO UPDATE
    SET
      role                 = 'admin',
      onboarding_completed = TRUE;

    RAISE NOTICE 'Admin role set for ansarnurlan2@gmail.com (user_id: %)', v_user_id;
  ELSE
    RAISE NOTICE 'User ansarnurlan2@gmail.com not found in auth.users yet. Will be set on first login via trigger.';
  END IF;
END $$;

-- ==============================================================================
-- 16. REALTIME
-- ==============================================================================
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.micro_tickets;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ==============================================================================
-- 17. SEED DATA (опционально — учебные модули)
-- ==============================================================================
INSERT INTO public.modules (id, title, slug, order_index) VALUES
  ('11111111-1111-1111-1111-111111111111', 'SAT Math — Квадратные функции',   'sat-math-quadratic', 1),
  ('22222222-2222-2222-2222-222222222222', 'Подготовка к СОР/СОЧ: Алгебра',    'sor-soch-algebra',   2),
  ('33333333-3333-3333-3333-333333333333', 'Алгоритмы и Структуры данных',      'algorithms-ds',      3)
ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- ГОТОВО ✅
-- Применено:
--   • Таблицы: profiles, courses, modules, skill_nodes, micro_tickets, certificates
--   • Enum: user_role, ticket_status
--   • RLS политики с is_admin() helper (без рекурсии)
--   • Триггер: handle_new_user (admin lock для ansarnurlan2@gmail.com)
--   • Триггер: volunteer minutes + certificate
--   • Admin lock через SQL DO $$...$$
--   • Realtime для micro_tickets, profiles, courses
-- ==============================================================================
