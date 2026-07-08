-- Optional sample data for prototyping with a real Supabase project.
--
-- How to use:
--   1. Run supabase/migrations/001_init.sql first.
--   2. Sign in to the app once with your own @aui.ma email (this creates
--      your profile through the auth trigger).
--   3. Run this file in the SQL editor. It fills in your profile and posts
--      a few rides and a request under YOUR account so every screen has
--      content to show.
--
-- Everything is plain data you can delete later:
--   delete from rides; delete from ride_requests;

with me as (
  select id from public.profiles order by created_at asc limit 1
)
update public.profiles
set full_name = coalesce(nullif(full_name, ''), 'Test Account'),
    phone = coalesce(phone, '0612000000'),
    bio = coalesce(bio, 'Prototype account for testing AUI Carpool.')
where id in (select id from me);

with me as (
  select id from public.profiles order by created_at asc limit 1
)
insert into public.rides
  (driver_id, from_city, from_detail, to_city, to_detail, departure_at,
   seats_total, price_per_seat, car_model, car_color, notes, is_recurring, recurrence_days)
select id, v.* from me, (values
  ('Ifrane', 'AUI main gate', 'Fès', 'Atlas', now() + interval '2 days',
   3, 40, 'Renault Clio 4', 'White', 'Test ride. Leaving after class.', true, array['fri']),
  ('Ifrane', 'Marché parking', 'Casablanca', 'Maârif', now() + interval '3 days',
   3, 150, 'Dacia Duster', 'Grey', 'Highway all the way, one coffee stop.', false, array[]::text[]),
  ('Fès', 'Atlas roundabout', 'Ifrane', 'AUI main gate', now() + interval '4 days',
   2, 40, 'Peugeot 208', 'Blue', 'Sunday return to campus.', true, array['sun'])
) as v(from_city, from_detail, to_city, to_detail, departure_at,
       seats_total, price_per_seat, car_model, car_color, notes, is_recurring, recurrence_days);

with me as (
  select id from public.profiles order by created_at asc limit 1
)
insert into public.ride_requests
  (rider_id, from_city, to_city, travel_date, time_of_day, seats, notes)
select id, 'Ifrane', 'Rabat', (now() + interval '5 days')::date, 'afternoon', 1,
       'Test request. Flexible after 2pm.'
from me;
