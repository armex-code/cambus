-- AUI Carpool — initial schema
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh project.

-- ---------------------------------------------------------------- profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  phone text,
  bio text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile for each new auth user; hard-reject non-AUI emails
-- as a second line of defense behind the app-side check.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.email !~* '^[a-z0-9._%+-]+@aui\.ma$' then
    raise exception 'Only @aui.ma emails can register';
  end if;
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    lower(new.email),
    initcap(replace(split_part(new.email, '@', 1), '.', ' '))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------- rides
create table public.rides (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles (id) on delete cascade,
  from_city text not null,
  from_detail text,
  to_city text not null,
  to_detail text,
  departure_at timestamptz not null,
  seats_total int not null check (seats_total between 1 and 4),
  price_per_seat int not null check (price_per_seat between 0 and 1000),
  car_model text,
  car_color text,
  notes text,
  is_recurring boolean not null default false,
  recurrence_days text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'cancelled')),
  created_at timestamptz not null default now()
);

create index rides_browse_idx on public.rides (status, departure_at);
create index rides_driver_idx on public.rides (driver_id);

-- ---------------------------------------------------------------- bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null references public.rides (id) on delete cascade,
  passenger_id uuid not null references public.profiles (id) on delete cascade,
  seats int not null check (seats between 1 and 4),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz not null default now()
);

create index bookings_ride_idx on public.bookings (ride_id);
create index bookings_passenger_idx on public.bookings (passenger_id);

-- ----------------------------------------------------------- ride_requests
create table public.ride_requests (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid not null references public.profiles (id) on delete cascade,
  from_city text not null,
  to_city text not null,
  travel_date date not null,
  time_of_day text not null default 'flexible'
    check (time_of_day in ('morning', 'afternoon', 'evening', 'flexible')),
  seats int not null default 1 check (seats between 1 and 4),
  notes text,
  status text not null default 'open' check (status in ('open', 'fulfilled', 'closed')),
  created_at timestamptz not null default now()
);

create index ride_requests_browse_idx on public.ride_requests (status, travel_date);

-- ----------------------------------------------------------------- reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id) on delete cascade,
  reviewee_id uuid not null references public.profiles (id) on delete cascade,
  reviewed_as text not null check (reviewed_as in ('driver', 'passenger')),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (booking_id, reviewer_id)
);

create index reviews_reviewee_idx on public.reviews (reviewee_id);

-- ------------------------------------------------------------------- views
-- Public directory: names + ratings, never email or phone.
create view public.profiles_public as
select
  p.id,
  p.full_name,
  p.bio,
  p.created_at,
  (select round(avg(r.rating)::numeric, 1) from public.reviews r
    where r.reviewee_id = p.id and r.reviewed_as = 'driver') as driver_avg,
  (select count(*) from public.reviews r
    where r.reviewee_id = p.id and r.reviewed_as = 'driver') as driver_count,
  (select round(avg(r.rating)::numeric, 1) from public.reviews r
    where r.reviewee_id = p.id and r.reviewed_as = 'passenger') as passenger_avg,
  (select count(*) from public.reviews r
    where r.reviewee_id = p.id and r.reviewed_as = 'passenger') as passenger_count
from public.profiles p;

-- Seats already taken per ride (accepted bookings only), readable by anyone
-- so ride listings can show availability without exposing bookings.
create view public.ride_seats as
select ride_id, coalesce(sum(seats), 0)::int as seats_taken
from public.bookings
where status = 'accepted'
group by ride_id;

-- -------------------------------------------------------------------- RPC
-- Phone numbers are exchanged only between the two parties of an accepted
-- booking. Security definer so it can read past RLS, with its own checks.
create or replace function public.get_contact_phone(p_booking_id uuid)
returns table (phone text, name text)
language plpgsql
security definer set search_path = public
as $$
declare
  v_booking public.bookings%rowtype;
  v_ride public.rides%rowtype;
  v_other uuid;
begin
  select * into v_booking from public.bookings where id = p_booking_id;
  if not found or v_booking.status <> 'accepted' then
    return;
  end if;
  select * into v_ride from public.rides where id = v_booking.ride_id;
  if auth.uid() = v_booking.passenger_id then
    v_other := v_ride.driver_id;
  elsif auth.uid() = v_ride.driver_id then
    v_other := v_booking.passenger_id;
  else
    return;
  end if;
  return query
    select p.phone, p.full_name from public.profiles p
    where p.id = v_other and p.phone is not null;
end;
$$;

-- --------------------------------------------------------------------- RLS
alter table public.profiles enable row level security;
alter table public.rides enable row level security;
alter table public.bookings enable row level security;
alter table public.ride_requests enable row level security;
alter table public.reviews enable row level security;

-- profiles: each user reads/updates only their own full row
-- (everyone else goes through the profiles_public view).
create policy "own profile read" on public.profiles
  for select using (auth.uid() = id);
create policy "own profile update" on public.profiles
  for update using (auth.uid() = id);

-- rides: public browse; drivers manage their own.
create policy "rides are public" on public.rides
  for select using (true);
create policy "drivers insert own rides" on public.rides
  for insert with check (auth.uid() = driver_id);
create policy "drivers update own rides" on public.rides
  for update using (auth.uid() = driver_id);

-- bookings: visible to the passenger and the ride's driver.
create policy "participants read bookings" on public.bookings
  for select using (
    auth.uid() = passenger_id
    or auth.uid() in (select driver_id from public.rides where id = ride_id)
  );
create policy "passengers create bookings" on public.bookings
  for insert with check (auth.uid() = passenger_id);
create policy "participants update bookings" on public.bookings
  for update using (
    auth.uid() = passenger_id
    or auth.uid() in (select driver_id from public.rides where id = ride_id)
  );

-- ride_requests: signed-in students browse; riders manage their own.
create policy "requests readable by students" on public.ride_requests
  for select using (auth.role() = 'authenticated');
create policy "riders insert own requests" on public.ride_requests
  for insert with check (auth.uid() = rider_id);
create policy "riders update own requests" on public.ride_requests
  for update using (auth.uid() = rider_id);

-- reviews: public reputation; authors write once (unique constraint).
create policy "reviews are public" on public.reviews
  for select using (true);
create policy "reviewers insert own reviews" on public.reviews
  for insert with check (auth.uid() = reviewer_id);

-- Views/RPC grants (anon may browse rides; everything else needs auth).
grant select on public.profiles_public to anon, authenticated;
grant select on public.ride_seats to anon, authenticated;
grant execute on function public.get_contact_phone to authenticated;

-- Postgres grants EXECUTE on new functions to PUBLIC by default; tighten it.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.get_contact_phone(uuid) from public, anon;
