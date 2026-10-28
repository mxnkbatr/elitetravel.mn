-- Tours and news move from src/data into the database so staff can edit them from /admin.
-- Each row keeps the full object as jsonb (same shape as the Tour / NewsItem types), plus
-- `position` for ordering. Read and written only by the Next.js server (secret key):
-- RLS is on with no policies, exactly like booking_requests.
create table if not exists public.tours (
  id          text primary key check (id ~ '^[a-z0-9-]{2,60}$'),
  position    integer not null default 0,
  data        jsonb not null,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

create table if not exists public.news (
  id          text primary key check (id ~ '^[a-z0-9-]{2,60}$'),
  position    integer not null default 0,
  data        jsonb not null,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

-- Who may open /admin. Accounts themselves live in Supabase Auth; this is the allowlist.
create table if not exists public.admin_users (
  email       text primary key check (email = lower(email)),
  created_at  timestamptz not null default now()
);

alter table public.tours enable row level security;
alter table public.news enable row level security;
alter table public.admin_users enable row level security;

-- Staff notes on a booking (who called, what was agreed)
alter table public.booking_requests add column if not exists staff_note text
  check (staff_note is null or char_length(staff_note) <= 1000);
alter table public.booking_requests add column if not exists updated_at timestamptz;
