-- Booking requests submitted from the site's booking planner.
-- Written only by the Next.js API (secret key / service role); RLS is on with no
-- policies, so the publishable key can neither read nor write this table.
create table if not exists public.booking_requests (
  id              text primary key,                -- ET-XXXXXXXX, shown to the traveller
  created_at      timestamptz not null default now(),
  tour_id         text not null,
  tour_title      text not null,
  travel_date     text,
  name            text not null check (char_length(name) between 2 and 80),
  phone           text not null check (phone ~ '^[0-9+ ]{8,20}$'),
  adults          smallint not null check (adults between 1 and 30),
  kids_own_bed    smallint not null default 0 check (kids_own_bed between 0 and 30),
  kids_shared_bed smallint not null default 0 check (kids_shared_bed between 0 and 30),
  single_rooms    smallint not null default 0 check (single_rooms between 0 and 30),
  total           bigint not null check (total >= 0),
  deposit         bigint not null default 0 check (deposit >= 0),
  note            text check (note is null or char_length(note) <= 500),
  status          text not null default 'new'
                  check (status in ('new', 'contacted', 'confirmed', 'paid', 'cancelled')),
  source          text not null default 'web'
);

create index if not exists booking_requests_created_at_idx on public.booking_requests (created_at desc);
create index if not exists booking_requests_status_idx on public.booking_requests (status);

alter table public.booking_requests enable row level security;
