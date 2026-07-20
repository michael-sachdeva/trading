-- ============================================================================
-- TradeMaster AI Academy — Database Schema
-- Run in Supabase SQL editor (or via `supabase db push`).
-- Assumes auth.users is managed by Supabase Auth.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- PROFILES (extends auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  role text not null default 'student' check (role in ('student', 'admin', 'instructor', 'affiliate')),
  preferred_language text not null default 'en' check (preferred_language in ('en', 'hi')),
  referred_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- PLANS (Basic / Advanced / Master AI Program)
-- ---------------------------------------------------------------------------
create table public.plans (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,            -- 'basic' | 'advanced' | 'master'
  name text not null,
  tier int not null,                    -- 1, 2, 3 — used to compute upgrade deltas
  price_inr numeric(10,2) not null,
  description text,
  features jsonb not null default '[]', -- array of feature strings for pricing card
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- COURSES / MODULES / LESSONS
-- ---------------------------------------------------------------------------
create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  short_description text,
  long_description text,
  thumbnail_url text,
  min_plan_tier int not null default 1,  -- minimum plan tier required to access
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  summary text,
  sort_order int not null default 0,
  duration_seconds int,
  is_preview boolean not null default false, -- free preview lesson
  created_at timestamptz not null default now(),
  unique (module_id, slug)
);

-- One row per language per lesson, so future languages can be added without schema changes
create table public.lesson_content (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  language text not null check (language in ('en', 'hi')),
  video_url text,               -- secure/signed Supabase Storage path or external HLS URL
  video_provider text default 'supabase', -- 'supabase' | 'mux' | 'bunny' etc.
  notes_html text,              -- rich-text written notes
  pdf_url text,
  summary_html text,
  unique (lesson_id, language)
);

create table public.lesson_assets (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  language text not null default 'en',
  asset_type text not null check (asset_type in ('image', 'chart', 'pdf', 'other')),
  url text not null,
  caption text,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- QUIZZES
-- ---------------------------------------------------------------------------
create table public.quizzes (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  passing_score int not null default 60,
  created_at timestamptz not null default now()
);

create table public.quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null,        -- [{ "id": "a", "text": "..." }, ...]
  correct_option_id text not null,
  explanation text,
  sort_order int not null default 0
);

create table public.quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  score int not null,
  passed boolean not null,
  answers jsonb not null,
  attempted_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- COUPONS (defined before orders — orders references coupons.id)
-- ---------------------------------------------------------------------------
create table public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount_type text not null check (discount_type in ('flat', 'percent')),
  discount_value numeric(10,2) not null,
  max_uses int,
  used_count int not null default 0,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  is_active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- ORDERS / PAYMENTS (Razorpay)
-- ---------------------------------------------------------------------------
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  order_type text not null default 'purchase' check (order_type in ('purchase', 'upgrade')),
  from_plan_id uuid references public.plans(id), -- populated for upgrades
  amount_inr numeric(10,2) not null,
  coupon_id uuid references public.coupons(id),
  razorpay_order_id text unique not null,
  status text not null default 'created' check (status in ('created', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  razorpay_payment_id text unique not null,
  razorpay_signature text not null,
  amount_inr numeric(10,2) not null,
  status text not null check (status in ('captured', 'failed', 'refunded')),
  invoice_number text unique,
  invoice_url text,
  raw_webhook_payload jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ENROLLMENTS (what a user currently has access to)
-- ---------------------------------------------------------------------------
create table public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  order_id uuid references public.orders(id),
  active boolean not null default true,
  enrolled_at timestamptz not null default now(),
  unique (user_id)  -- one active plan per user; upgrades replace the row
);

-- ---------------------------------------------------------------------------
-- PROGRESS / BOOKMARKS / CERTIFICATES
-- ---------------------------------------------------------------------------
create table public.lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  is_completed boolean not null default false,
  last_position_seconds int not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  note text,
  timestamp_seconds int,
  created_at timestamptz not null default now()
);

create table public.certificates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  certificate_number text unique not null,
  issued_at timestamptz not null default now(),
  pdf_url text,
  verification_code text unique not null
);

-- ---------------------------------------------------------------------------
-- AFFILIATES
-- ---------------------------------------------------------------------------
create table public.affiliates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references public.profiles(id) on delete cascade,
  referral_code text unique not null,
  commission_percent numeric(5,2) not null default 10,
  total_earned_inr numeric(10,2) not null default 0,
  total_paid_inr numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.affiliate_referrals (
  id uuid primary key default uuid_generate_v4(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  referred_user_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id),
  commission_inr numeric(10,2),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'paid')),
  created_at timestamptz not null default now()
);

create table public.affiliate_payout_requests (
  id uuid primary key default uuid_generate_v4(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  amount_inr numeric(10,2) not null,
  status text not null default 'requested' check (status in ('requested', 'processing', 'paid', 'rejected')),
  requested_at timestamptz not null default now(),
  processed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS / ANNOUNCEMENTS / SUPPORT
-- ---------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null, -- 'purchase_success' | 'welcome' | 'completion' | 'upgrade_offer' | 'password_reset' | 'announcement'
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null,
  audience_min_tier int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.support_ticket_replies (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  message text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index idx_modules_course on public.modules(course_id);
create index idx_lessons_module on public.lessons(module_id);
create index idx_lesson_content_lesson on public.lesson_content(lesson_id);
create index idx_progress_user on public.lesson_progress(user_id);
create index idx_orders_user on public.orders(user_id);
create index idx_payments_order on public.payments(order_id);
create index idx_enrollments_user on public.enrollments(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.certificates enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_ticket_replies enable row level security;
alter table public.notifications enable row level security;
alter table public.affiliates enable row level security;
alter table public.affiliate_referrals enable row level security;
alter table public.affiliate_payout_requests enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_content enable row level security;
alter table public.lesson_assets enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Profiles: user can read/update own row; admins can read all
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Courses/modules/lessons metadata: publicly readable (marketing pages need this);
-- actual video/notes content is gated in lesson_content below.
create policy "courses_public_read" on public.courses for select using (is_published = true or public.is_admin());
create policy "modules_public_read" on public.modules for select using (true);
create policy "lessons_public_read" on public.lessons for select using (true);
create policy "courses_admin_write" on public.courses for all using (public.is_admin());
create policy "modules_admin_write" on public.modules for all using (public.is_admin());
create policy "lessons_admin_write" on public.lessons for all using (public.is_admin());

-- Lesson content: gated to preview lessons OR users with an active enrollment
-- whose plan tier covers the course's min_plan_tier.
create policy "lesson_content_gated_read" on public.lesson_content
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.lessons l
      join public.modules m on m.id = l.module_id
      join public.courses c on c.id = m.course_id
      where l.id = lesson_content.lesson_id
        and (
          l.is_preview = true
          or exists (
            select 1 from public.enrollments e
            join public.plans p on p.id = e.plan_id
            where e.user_id = auth.uid()
              and e.active = true
              and p.tier >= c.min_plan_tier
          )
        )
    )
  );
create policy "lesson_content_admin_write" on public.lesson_content for all using (public.is_admin());
create policy "lesson_assets_gated_read" on public.lesson_assets for select using (public.is_admin() or true);

-- Orders/payments: user sees own; admin sees all
create policy "orders_owner_or_admin" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = user_id);
create policy "payments_owner_or_admin" on public.payments for select using (
  exists (select 1 from public.orders o where o.id = payments.order_id and o.user_id = auth.uid())
  or public.is_admin()
);

-- Enrollments: user sees own
create policy "enrollments_owner_or_admin" on public.enrollments for select using (auth.uid() = user_id or public.is_admin());

-- Progress/bookmarks/certificates/quiz attempts: user manages own
create policy "progress_owner" on public.lesson_progress for all using (auth.uid() = user_id);
create policy "bookmarks_owner" on public.bookmarks for all using (auth.uid() = user_id);
create policy "certificates_owner_or_admin" on public.certificates for select using (auth.uid() = user_id or public.is_admin());
create policy "quiz_attempts_owner" on public.quiz_attempts for all using (auth.uid() = user_id);

-- Notifications: owner only
create policy "notifications_owner" on public.notifications for all using (auth.uid() = user_id);

-- Support: owner + admin
create policy "tickets_owner_or_admin" on public.support_tickets for select using (auth.uid() = user_id or public.is_admin());
create policy "tickets_insert_own" on public.support_tickets for insert with check (auth.uid() = user_id);
create policy "ticket_replies_participant" on public.support_ticket_replies for select using (
  exists (select 1 from public.support_tickets t where t.id = ticket_id and (t.user_id = auth.uid() or public.is_admin()))
);

-- Affiliates: owner sees own affiliate record + referrals
create policy "affiliates_owner_or_admin" on public.affiliates for select using (auth.uid() = user_id or public.is_admin());
create policy "affiliate_referrals_owner_or_admin" on public.affiliate_referrals for select using (
  exists (select 1 from public.affiliates a where a.id = affiliate_id and (a.user_id = auth.uid() or public.is_admin()))
);
create policy "affiliate_payouts_owner_or_admin" on public.affiliate_payout_requests for select using (
  exists (select 1 from public.affiliates a where a.id = affiliate_id and (a.user_id = auth.uid() or public.is_admin()))
);

-- ============================================================================
-- TRIGGER: auto-create profile row on signup
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
