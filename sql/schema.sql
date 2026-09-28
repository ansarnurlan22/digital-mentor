-- ==============================================================================
-- DIGITAL MENTOR: 70/30 HYBRID AI + VOLUNTEERS DATABASE SCHEMA
-- Strict Minimalist Architecture: Profiles, Modules, Skill Nodes, Micro-Tickets, Certificates
-- ==============================================================================

-- 1. Custom Enums & Types
do $$ begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('student', 'mentor', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'ticket_status') then
    create type public.ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
  end if;
end $$;

-- 2. Profiles & Roles Table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role public.user_role default 'student'::public.user_role not null,
  full_name text not null,
  avatar_url text,
  xp int default 0 not null,
  streak_days int default 0 not null,
  volunteer_minutes int default 0 not null,
  mentor_rating numeric(3, 2) default 5.00 not null,
  created_at timestamptz default now() not null
);

-- 3. Modules & Minimalist Nodes
create table if not exists public.modules (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  order_index int not null,
  created_at timestamptz default now() not null
);

create table if not exists public.skill_nodes (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  node_type text check (node_type in ('interactive_step', 'capstone_boss')) not null,
  order_index int not null,
  problem_statement text,
  initial_code text,
  expected_solution text,
  ai_rubric jsonb,
  created_at timestamptz default now() not null
);

-- 4. 70/30 Architecture: Micro-Tickets
create table if not exists public.micro_tickets (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  mentor_id uuid references public.profiles(id) on delete set null,
  node_id uuid references public.skill_nodes(id) on delete cascade not null,
  status public.ticket_status default 'open'::public.ticket_status not null,
  code_context text,
  student_query text not null,
  mentor_answer text,
  ai_summary text,
  awarded_minutes int default 15 not null,
  created_at timestamptz default now() not null,
  resolved_at timestamptz
);

-- 5. Volunteer Verification & Certificates
create table if not exists public.certificates (
  id uuid default gen_random_uuid() primary key,
  mentor_id uuid references public.profiles(id) on delete cascade not null,
  verification_token text unique not null,
  total_hours numeric(5, 2) not null,
  issued_at timestamptz default now() not null
);

-- Indexes for maximum query performance
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_micro_tickets_status on public.micro_tickets(status);
create index if not exists idx_micro_tickets_student on public.micro_tickets(student_id);
create index if not exists idx_micro_tickets_mentor on public.micro_tickets(mentor_id);
create index if not exists idx_certificates_token on public.certificates(verification_token);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.modules enable row level security;
alter table public.skill_nodes enable row level security;
alter table public.micro_tickets enable row level security;
alter table public.certificates enable row level security;

-- PROFILES POLICIES
create policy "Allow read all profiles" 
  on public.profiles for select 
  using (true);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Admins can update any profile" 
  on public.profiles for all 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- MODULES & SKILL NODES POLICIES
create policy "Allow read modules" 
  on public.modules for select 
  using (true);

create policy "Allow read skill_nodes" 
  on public.skill_nodes for select 
  using (true);

create policy "Admins can modify curriculum" 
  on public.modules for all 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can modify skill nodes" 
  on public.skill_nodes for all 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- MICRO-TICKETS POLICIES (70/30 Hybrid Engine)
create policy "Students can view own tickets" 
  on public.micro_tickets for select 
  using (
    auth.uid() = student_id 
    or exists (
      select 1 from public.profiles 
      where id = auth.uid() and role in ('mentor', 'admin')
    )
  );

create policy "Students can create micro_tickets" 
  on public.micro_tickets for insert 
  with check (auth.uid() = student_id);

create policy "Mentors and students can update their tickets" 
  on public.micro_tickets for update 
  using (
    auth.uid() = student_id 
    or auth.uid() = mentor_id 
    or (
      status = 'open' and exists (
        select 1 from public.profiles 
        where id = auth.uid() and role in ('mentor', 'admin')
      )
    )
  );

-- CERTIFICATES POLICIES
create policy "Public verification of certificates" 
  on public.certificates for select 
  using (true);

create policy "Admins can manage certificates" 
  on public.certificates for all 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- ==============================================================================
-- 7. TRIGGERS & AUTOMATION
-- ==============================================================================

-- A. Auto-create Profile upon Supabase auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    case 
      when lower(new.email) in ('ansarnurlan2@gmail.com') then 'admin'::public.user_role
      else 'student'::public.user_role
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- B. Auto-award volunteer minutes & sync certificate when Micro-Ticket is resolved
create or replace function public.handle_micro_ticket_resolution()
returns trigger as $$
declare
  v_total_hours numeric(5, 2);
  v_token text;
begin
  if (old.status is distinct from 'resolved' and new.status = 'resolved' and new.mentor_id is not null) then
    -- 1. Начисляем волонтерские минуты ментору
    update public.profiles
    set volunteer_minutes = volunteer_minutes + coalesce(new.awarded_minutes, 15)
    where id = new.mentor_id;

    -- 2. Пересчитываем суммарные часы
    select round((volunteer_minutes / 60.0)::numeric, 2)
    into v_total_hours
    from public.profiles
    where id = new.mentor_id;

    -- 3. Создаем или обновляем официальный сертификат верификации
    v_token := 'DM-' || upper(substr(md5(new.mentor_id::text), 1, 8)) || '-' || to_char(now(), 'YYMM');
    
    insert into public.certificates (mentor_id, verification_token, total_hours, issued_at)
    values (new.mentor_id, v_token, v_total_hours, now())
    on conflict (verification_token) do update
    set total_hours = excluded.total_hours, issued_at = now();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_micro_ticket_resolved on public.micro_tickets;
create trigger on_micro_ticket_resolved
  after update on public.micro_tickets
  for each row execute procedure public.handle_micro_ticket_resolution();

-- ==============================================================================
-- 8. REALTIME SUBSCRIPTION CHANNELS
-- ==============================================================================
do $$ begin
  alter publication supabase_realtime add table public.micro_tickets;
exception when others then null;
end $$;

do $$ begin
  alter publication supabase_realtime add table public.profiles;
exception when others then null;
end $$;
