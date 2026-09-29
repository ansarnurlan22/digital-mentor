-- Migration: Clean Profiles and Onboarding Schema for Digital Mentor
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('student', 'mentor');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text NOT NULL,
  grade text NOT NULL,
  role user_role NOT NULL,
  onboarding_completed boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile once" ON public.profiles;
CREATE POLICY "Users can insert their own profile once"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their profile except role" ON public.profiles;
CREATE POLICY "Users can update their profile except role"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
