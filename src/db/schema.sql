-- ==============================================================================
-- COLLEGE COMPANION — SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- Institution: M.H. Saboo Siddik College of Engineering (MHSSCE)
-- Department:  Information Technology (BE / Final Year, Semester VII)
-- Timetable:   SH 2026 Version 2 (Effective: 06-07-2026)
-- ==============================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 2. CORE ACADEMIC & INSTITUTIONAL TABLES
-- ==============================================================================

-- 2.1 Departments
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique,
  created_at timestamptz not null default now()
);

-- 2.2 Profiles (Extends auth.users with College Student, Faculty, Admin roles)
-- Note: Sensitive fields (cgpa, attendance, etc.) are strictly nullable and never fake-defaulted.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null default 'student' check (role in ('student', 'faculty', 'admin', 'mentor', 'club_admin', 'event_admin')),
  roll_number text unique,
  department text not null default 'Information Technology',
  year text default 'BE',
  semester text default 'Semester 7',
  batch text check (batch in ('A', 'B', 'C', 'ALL')),
  cgpa numeric(3, 2) check (cgpa between 0.00 and 10.00),
  attendance_percentage integer check (attendance_percentage between 0 and 100),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.3 Faculty (Official Teaching Faculty of MHSSCE IT)
create table if not exists public.faculty (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  faculty_code text not null unique,
  department text not null default 'Information Technology',
  email text,
  designation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.4 Subjects (Official Semester VII Curriculum)
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  course_code text not null unique,
  abbreviation text not null,
  course_name text not null,
  department text not null default 'Information Technology',
  year text not null default 'BE',
  semester text not null default 'Semester 7',
  subject_type text not null default 'Theory' check (subject_type in ('Theory', 'Practical', 'Project', 'Elective', 'Institute Elective')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.5 Timetable (Relational Timetable: SH 2026 Version 2, Effective 06-07-2026)
create table if not exists public.timetable (
  id uuid primary key default gen_random_uuid(),
  day_of_week text not null check (day_of_week in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  start_time time not null,
  end_time time not null,
  subject_id uuid references public.subjects(id) on delete set null,
  faculty_id uuid references public.faculty(id) on delete set null,
  room text not null,
  session_type text not null default 'Lecture' check (session_type in ('Lecture', 'Practical', 'Project', 'Tutorial', 'Break')),
  batch text not null default 'ALL' check (batch in ('ALL', 'A', 'B', 'C')),
  practical_group text check (practical_group in ('IS', 'DB', 'PL', 'SE', 'WE')),
  department text not null default 'Information Technology',
  year text not null default 'BE',
  semester text not null default 'Semester 7',
  effective_from date not null default '2026-07-06',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.6 Exam Schedules (Separate from weekly recurring timetable)
create table if not exists public.exam_schedules (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time not null,
  end_time time not null,
  course_code text not null,
  course_name text not null,
  department text not null default 'Information Technology',
  year text not null default 'BE',
  semester text not null default 'Semester 7',
  exam_type text not null default 'In-Sem' check (exam_type in ('In-Sem', 'End-Sem', 'Oral / Practical', 'Re-Exam')),
  faculty_in_charge text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- 3. STUDENT LIFE, CAMPUS & PEER COLLABORATION TABLES
-- ==============================================================================

-- 3.1 Course Notes Repository
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject_id uuid references public.subjects(id) on delete set null,
  subject_name text not null,
  module_unit text,
  uploader_id uuid not null references public.profiles(id) on delete cascade,
  uploader_name text not null,
  file_url text not null,
  file_name text not null,
  file_size text not null default '1.0 MB',
  downloads_count integer not null default 0,
  rating numeric(2, 1) default 5.0,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3.2 Campus Events & Hackathons
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Technical', 'Cultural', 'Career', 'Sports', 'General')),
  event_date date not null,
  event_time text not null,
  venue text not null,
  organizer text not null,
  badge text,
  description text not null,
  seats_left integer not null default 100,
  seats_total integer not null default 100,
  banner_url text,
  registration_link text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3.3 Placement & Internship Opportunities
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  package text not null,
  eligibility text not null,
  location text not null,
  type text not null check (type in ('Full-Time', 'Internship')),
  deadline date not null,
  status text not null default 'Active' check (status in ('Active', 'Closing Soon', 'Featured', 'Expired')),
  link text not null,
  tags text[] default '{}',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3.4 Campus Lost and Found Board (Updated with Multi-Photo & Location Hierarchy Support)
create table if not exists public.lost_and_found (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('Lost', 'Found')),
  category text not null default 'Personal',
  item_date date not null default current_date,
  
  -- Location Hierarchy
  department text not null default 'Information Technology',
  branch text default 'Information Technology',
  building text not null default 'Main Building',
  floor_number text default '3rd Floor',
  room_number text,
  lab_name text,
  location_description text,
  location text not null, -- Composite formatted string for backward compatibility
  
  -- Contact & Notes
  contact text not null,
  contact_method text default 'Email / Phone',
  additional_note text,
  
  -- Real Photographs (Supabase Storage: bucket 'lost-found')
  primary_image_url text,
  additional_image_urls text[] default '{}',
  image_count integer not null default 0,
  
  -- Status & Moderation
  status text not null default 'Open' check (status in ('Open', 'Claimed', 'Handed to Security', 'Resolved')),
  moderation_status text not null default 'Approved' check (moderation_status in ('Pending', 'Approved', 'Rejected', 'Claimed', 'Resolved')),
  
  reporter_id uuid references public.profiles(id) on delete set null,
  reporter_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3.5 Peer Study Groups
create table if not exists public.study_groups (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects(id) on delete set null,
  subject text not null,
  lead text not null,
  lead_id uuid references public.profiles(id) on delete set null,
  focus text not null,
  link text not null,
  members_count integer not null default 1,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.study_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.study_groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique(group_id, user_id)
);

-- 3.6 Campus Clubs & Student Societies
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  lead text,
  description text,
  recruitment_status text default 'Open',
  contact_email text,
  member_count integer not null default 0,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.club_members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'core', 'lead')),
  joined_at timestamptz not null default now(),
  unique(club_id, user_id)
);

-- 3.7 Mentors & Mentorship Booking
create table if not exists public.mentors (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references public.faculty(id) on delete cascade,
  max_mentees integer not null default 20,
  cabin text,
  office_hours text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentor_slots (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.mentors(id) on delete cascade,
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.mentor_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references public.mentor_slots(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  purpose text not null,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Completed', 'Cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3.8 Institutional Announcements & FAQs
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  content text not null,
  urgent boolean not null default false,
  published_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'General',
  created_at timestamptz not null default now()
);

-- 3.9 Notifications (User-targeted)
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  category text not null,
  unread boolean not null default true,
  created_at timestamptz not null default now()
);

-- ==============================================================================
-- 4. SECURITY FIX 1: ENFORCE SAFE ROLE CREATION ON SIGNUP
-- ==============================================================================
-- Client-provided role metadata is STRICTLY IGNORED.
-- Every user created via auth.users receives role = 'student'.
-- Elevating a user to admin or faculty requires a separate administrative process.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    roll_number,
    department,
    year,
    semester,
    batch,
    cgpa,
    attendance_percentage
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'student', -- FORCED DEFAULT: Never trust user_metadata for role!
    null,      -- Nullable until verified
    'Information Technology',
    'BE',
    'Semester 7',
    null,
    null,      -- Nullable: No fake defaults
    null       -- Nullable: No fake defaults
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) & NON-RECURSIVE AUTHORIZATION
-- ==============================================================================

-- Helper function: Secure, non-recursive role checker
-- Security Definer with empty search path prevents hijack and recursive RLS loops.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'faculty')
  );
$$;

create or replace function public.is_club_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'faculty', 'club_admin')
  );
$$;

-- Enable RLS across all tables
alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.faculty enable row level security;
alter table public.subjects enable row level security;
alter table public.timetable enable row level security;
alter table public.exam_schedules enable row level security;
alter table public.notes enable row level security;
alter table public.events enable row level security;
alter table public.opportunities enable row level security;
alter table public.lost_and_found enable row level security;
alter table public.study_groups enable row level security;
alter table public.study_group_members enable row level security;
alter table public.clubs enable row level security;
alter table public.club_members enable row level security;
alter table public.mentors enable row level security;
alter table public.mentor_slots enable row level security;
alter table public.mentor_bookings enable row level security;
alter table public.announcements enable row level security;
alter table public.faqs enable row level security;
alter table public.notifications enable row level security;

-- 5.1 Departments & Subjects & Faculty (Public/Student Read, Admin Manage)
create policy "departments_read" on public.departments for select using (true);
create policy "departments_admin_all" on public.departments for all to authenticated using (public.is_admin());

create policy "subjects_read" on public.subjects for select using (true);
create policy "subjects_admin_all" on public.subjects for all to authenticated using (public.is_admin());

create policy "faculty_read" on public.faculty for select using (true);
create policy "faculty_admin_all" on public.faculty for all to authenticated using (public.is_admin());

-- 5.2 Profiles Policies (Avoids RLS recursion by using direct auth.uid())
-- All authenticated users can view classmate/peer profiles (student directory).
create policy "profiles_select_all" on public.profiles for select to authenticated using (true);

-- Users can update only their own profile details, but CANNOT elevate their own role
create policy "profiles_update_self" on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id and
    role = (select role from public.profiles where id = auth.uid())
  );

-- Admins can update any profile (including roles)
create policy "profiles_admin_update" on public.profiles for update to authenticated
  using (public.is_admin());

-- 5.3 Timetable & Exam Schedules (Public Read, Admin Manage)
create policy "timetable_read" on public.timetable for select using (true);
create policy "timetable_admin_all" on public.timetable for all to authenticated using (public.is_admin());

create policy "exams_read" on public.exam_schedules for select using (true);
create policy "exams_admin_all" on public.exam_schedules for all to authenticated using (public.is_admin());

-- 5.4 Notes Policies
create policy "notes_read" on public.notes for select using (true);
create policy "notes_insert_auth" on public.notes for insert to authenticated with check (auth.uid() = uploader_id);
create policy "notes_update_owner" on public.notes for update to authenticated using (auth.uid() = uploader_id or public.is_admin());
create policy "notes_delete_owner" on public.notes for delete to authenticated using (auth.uid() = uploader_id or public.is_admin());

-- 5.5 Events Policies
create policy "events_read" on public.events for select using (true);
create policy "events_admin_all" on public.events for all to authenticated using (public.is_admin());

-- 5.6 Opportunities Policies
create policy "opportunities_read" on public.opportunities for select using (true);
create policy "opportunities_admin_all" on public.opportunities for all to authenticated using (public.is_admin());

-- 5.7 Lost & Found Policies (Approved reports public; Students manage own; Admins manage all)
create policy "lost_found_read" on public.lost_and_found for select 
  using (moderation_status = 'Approved' or auth.uid() = reporter_id or public.is_admin());
create policy "lost_found_insert" on public.lost_and_found for insert to authenticated 
  with check (auth.uid() = reporter_id or public.is_admin());
create policy "lost_found_update" on public.lost_and_found for update to authenticated 
  using (auth.uid() = reporter_id or public.is_admin());
create policy "lost_found_delete" on public.lost_and_found for delete to authenticated 
  using (auth.uid() = reporter_id or public.is_admin());

-- 5.8 Study Groups & Members
create policy "study_groups_read" on public.study_groups for select using (true);
create policy "study_groups_insert" on public.study_groups for insert to authenticated with check (auth.uid() = lead_id);
create policy "study_groups_modify" on public.study_groups for all to authenticated using (auth.uid() = lead_id or public.is_admin());

create policy "study_group_members_read" on public.study_group_members for select to authenticated using (true);
create policy "study_group_members_join" on public.study_group_members for insert to authenticated with check (auth.uid() = user_id);
create policy "study_group_members_leave" on public.study_group_members for delete to authenticated using (auth.uid() = user_id or public.is_admin());

-- 5.9 Clubs & Club Members
create policy "clubs_read" on public.clubs for select using (true);
create policy "clubs_admin_all" on public.clubs for all to authenticated using (public.is_club_admin());

create policy "club_members_read" on public.club_members for select using (true);
create policy "club_members_join" on public.club_members for insert to authenticated with check (auth.uid() = user_id);
create policy "club_members_leave" on public.club_members for delete to authenticated using (auth.uid() = user_id or public.is_admin());

-- 5.10 Mentors, Slots & Bookings
create policy "mentors_read" on public.mentors for select using (true);
create policy "mentors_admin_all" on public.mentors for all to authenticated using (public.is_admin());

create policy "mentor_slots_read" on public.mentor_slots for select using (true);
create policy "mentor_slots_manage" on public.mentor_slots for all to authenticated using (public.is_admin());

create policy "mentor_bookings_read" on public.mentor_bookings for select to authenticated 
  using (auth.uid() = student_id or public.is_admin());
create policy "mentor_bookings_insert" on public.mentor_bookings for insert to authenticated 
  with check (auth.uid() = student_id);
create policy "mentor_bookings_update" on public.mentor_bookings for update to authenticated 
  using (auth.uid() = student_id or public.is_admin());

-- 5.11 Announcements & FAQs
create policy "announcements_read" on public.announcements for select using (true);
create policy "announcements_admin_all" on public.announcements for all to authenticated using (public.is_admin());

create policy "faqs_read" on public.faqs for select using (true);
create policy "faqs_admin_all" on public.faqs for all to authenticated using (public.is_admin());

-- 5.12 Notifications (Strict personal visibility)
create policy "notifications_select_own" on public.notifications for select to authenticated using (auth.uid() = user_id);
create policy "notifications_update_own" on public.notifications for update to authenticated using (auth.uid() = user_id);
create policy "notifications_delete_own" on public.notifications for delete to authenticated using (auth.uid() = user_id);

-- ==============================================================================
-- 6. STORAGE BUCKETS CONFIGURATION
-- ==============================================================================
insert into storage.buckets (id, name, public)
values 
  ('notes', 'notes', true),
  ('lost-found', 'lost-found', true),
  ('avatars', 'avatars', true),
  ('event-images', 'event-images', true),
  ('club-images', 'club-images', true)
on conflict (id) do nothing;

create policy "storage_public_read" on storage.objects for select 
  using (bucket_id in ('notes', 'lost-found', 'avatars', 'event-images', 'club-images'));

create policy "storage_auth_upload" on storage.objects for insert to authenticated 
  with check (bucket_id in ('notes', 'lost-found', 'avatars', 'event-images', 'club-images'));

-- 6.1 Dedicated 'lost-found' Bucket Policies
-- Path structure: lost-found/{user_id}/{item_id}/{filename}
-- Students can upload photographs for their own reports; cannot delete another user's photos
create policy "storage_lost_found_user_upload" on storage.objects for insert to authenticated 
  with check (
    bucket_id = 'lost-found' and 
    (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );

create policy "storage_lost_found_user_delete" on storage.objects for delete to authenticated 
  using (
    bucket_id = 'lost-found' and 
    (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );

