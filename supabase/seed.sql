-- Sample data for prototyping with a real Supabase project.
--
-- Run AFTER supabase/migrations/001_init.sql. Re-runnable: fixed UUIDs and
-- "on conflict do nothing" everywhere.
--
-- Creates a fake AUI community: 9 members (including the shared demo
-- account demo@aui.ma, sign-in code 424242 in the app), upcoming and past
-- rides, bookings in every state, reviews, and open ride requests.
--
-- To wipe before real launch:
--   delete from auth.users where id::text like '11111111-%';
--   (cascades through profiles, rides, bookings, reviews, requests)

-- ---------------------------------------------------------------- members
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
   confirmation_token, recovery_token, email_change_token_new, email_change)
values
  -- demo account: fixed password so the app can sign it in with code 424242
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111101', 'authenticated', 'authenticated', 'demo@aui.ma',
   extensions.crypt('aui-carpool-demo-424242', extensions.gen_salt('bf')), now() - interval '60 days',
   '{"provider":"email","providers":["email"]}', '{}', now() - interval '60 days', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111102', 'authenticated', 'authenticated', 'y.benali@aui.ma', '', now() - interval '400 days',
   '{"provider":"email","providers":["email"]}', '{}', now() - interval '400 days', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111103', 'authenticated', 'authenticated', 's.elamrani@aui.ma', '', now() - interval '300 days',
   '{"provider":"email","providers":["email"]}', '{}', now() - interval '300 days', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111104', 'authenticated', 'authenticated', 'o.tazi@aui.ma', '', now() - interval '500 days',
   '{"provider":"email","providers":["email"]}', '{}', now() - interval '500 days', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111105', 'authenticated', 'authenticated', 'a.bennis@aui.ma', '', now() - interval '150 days',
   '{"provider":"email","providers":["email"]}', '{}', now() - interval '150 days', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111106', 'authenticated', 'authenticated', 'm.alaoui@aui.ma', '', now() - interval '350 days',
   '{"provider":"email","providers":["email"]}', '{}', now() - interval '350 days', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111107', 'authenticated', 'authenticated', 'r.chraibi@aui.ma', '', now() - interval '100 days',
   '{"provider":"email","providers":["email"]}', '{}', now() - interval '100 days', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111108', 'authenticated', 'authenticated', 'h.elfassi@aui.ma', '', now() - interval '250 days',
   '{"provider":"email","providers":["email"]}', '{}', now() - interval '250 days', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111109', 'authenticated', 'authenticated', 'n.squalli@aui.ma', '', now() - interval '70 days',
   '{"provider":"email","providers":["email"]}', '{}', now() - interval '70 days', now(), '', '', '', '')
on conflict (id) do nothing;

update public.profiles set full_name = v.full_name, phone = v.phone, bio = v.bio
from (values
  ('11111111-1111-4111-8111-111111111101'::uuid, 'Demo Student', '0612000000', 'Shared tour account. Look around, book a seat, try everything.'),
  ('11111111-1111-4111-8111-111111111102'::uuid, 'Yassine Benali', '0661234501', 'SBA senior. I drive home to Casa most weekends. Music requests welcome.'),
  ('11111111-1111-4111-8111-111111111103'::uuid, 'Salma El Amrani', '0661234502', 'CS junior. Fès every weekend, always on time.'),
  ('11111111-1111-4111-8111-111111111104'::uuid, 'Omar Tazi', '0661234503', 'Engineering grad student. Rabat runs on Fridays.'),
  ('11111111-1111-4111-8111-111111111105'::uuid, 'Aya Bennis', '0661234504', 'HRD sophomore, usually riding to Meknès.'),
  ('11111111-1111-4111-8111-111111111106'::uuid, 'Mehdi Alaoui', '0661234505', 'Marrakchi in exile. Long drives, good playlists.'),
  ('11111111-1111-4111-8111-111111111107'::uuid, 'Rim Chraibi', '0661234506', null),
  ('11111111-1111-4111-8111-111111111108'::uuid, 'Hamza El Fassi', '0661234507', 'Fassi, drives back every Sunday evening.'),
  ('11111111-1111-4111-8111-111111111109'::uuid, 'Nour Squalli', '0661234508', 'BA freshman. Looking for regular Rabat rides.')
) as v(id, full_name, phone, bio)
where profiles.id = v.id;

-- ------------------------------------------------------------------ rides
insert into public.rides
  (id, driver_id, from_city, from_detail, to_city, to_detail, departure_at,
   seats_total, price_per_seat, car_model, car_color, notes, is_recurring, recurrence_days)
values
  ('22222222-2222-4222-8222-222222222201', '11111111-1111-4111-8111-111111111103', 'Ifrane', 'AUI main gate', 'Azrou', 'Grand taxi station',
   now() + interval '8 hours', 3, 15, 'Renault Clio 4', 'White', 'Quick Azrou run after class. Leaving on the dot.', false, '{}'),
  ('22222222-2222-4222-8222-222222222202', '11111111-1111-4111-8111-111111111106', 'Ifrane', 'Marché parking', 'Meknès', 'Hamria',
   now() + interval '1 day 3 hours', 3, 40, 'Fiat Tipo', 'Silver', 'Can drop you anywhere central. One medium bag each please.', false, '{}'),
  ('22222222-2222-4222-8222-222222222203', '11111111-1111-4111-8111-111111111103', 'Ifrane', 'AUI main gate', 'Fès', 'Route d''Imouzzer / Atlas',
   now() + interval '2 days', 3, 40, 'Renault Clio 4', 'White', 'Weekly ride home. I leave right after Friday classes.', true, '{fri}'),
  ('22222222-2222-4222-8222-222222222204', '11111111-1111-4111-8111-111111111102', 'Ifrane', 'AUI main gate', 'Casablanca', 'Maârif or Gauthier',
   now() + interval '2 days 2 hours', 3, 150, 'Dacia Duster', 'Grey', 'Highway all the way, one coffee stop at Khouribga toll. AC works, promise.', true, '{fri}'),
  ('22222222-2222-4222-8222-222222222205', '11111111-1111-4111-8111-111111111104', 'Ifrane', 'Downtown, near La Paix', 'Rabat', 'Agdal',
   now() + interval '2 days 3 hours', 2, 120, 'Volkswagen Golf 7', 'Black', 'Two seats only, I keep the back seat free for bags.', true, '{fri}'),
  ('22222222-2222-4222-8222-222222222206', '11111111-1111-4111-8111-111111111106', 'Ifrane', 'Building 39 parking', 'Fès–Saïss Airport', 'Departures',
   now() + interval '3 days', 3, 80, 'Fiat Tipo', 'Silver', 'Early flight crew, this one is for you. I will wait 5 minutes max.', false, '{}'),
  ('22222222-2222-4222-8222-222222222207', '11111111-1111-4111-8111-111111111108', 'Fès', 'Atlas roundabout', 'Ifrane', 'AUI main gate',
   now() + interval '4 days', 3, 40, 'Peugeot 208', 'Blue', 'The Sunday return. Back on campus in the evening.', true, '{sun}'),
  ('22222222-2222-4222-8222-222222222208', '11111111-1111-4111-8111-111111111102', 'Casablanca', 'Oasis / Maârif pickup', 'Ifrane', 'AUI main gate',
   now() + interval '4 days 2 hours', 3, 150, 'Dacia Duster', 'Grey', 'Sunday return to campus. Leaving Casa at 5pm sharp.', true, '{sun}'),
  ('22222222-2222-4222-8222-222222222209', '11111111-1111-4111-8111-111111111106', 'Ifrane', 'AUI main gate', 'Marrakech', 'Guéliz',
   now() + interval '6 days', 3, 220, 'Fiat Tipo', 'Silver', 'Long one. Leaving early, lunch stop in Beni Mellal.', false, '{}'),
  -- demo account's own ride, with booking requests to manage
  ('22222222-2222-4222-8222-222222222210', '11111111-1111-4111-8111-111111111101', 'Ifrane', 'AUI main gate', 'Meknès', 'Ville nouvelle',
   now() + interval '2 days 1 hour', 3, 40, 'Renault Mégane', 'Red', 'Room for small bags. Leaving from the main gate.', false, '{}'),
  -- past rides for review history
  ('22222222-2222-4222-8222-222222222211', '11111111-1111-4111-8111-111111111103', 'Ifrane', 'AUI main gate', 'Fès', 'Atlas',
   now() - interval '3 days', 3, 40, 'Renault Clio 4', 'White', null, false, '{}'),
  ('22222222-2222-4222-8222-222222222212', '11111111-1111-4111-8111-111111111102', 'Ifrane', 'AUI main gate', 'Casablanca', 'Maârif',
   now() - interval '10 days', 3, 150, 'Dacia Duster', 'Grey', null, false, '{}'),
  ('22222222-2222-4222-8222-222222222213', '11111111-1111-4111-8111-111111111104', 'Ifrane', 'Downtown', 'Rabat', 'Agdal',
   now() - interval '12 days', 2, 120, 'Volkswagen Golf 7', 'Black', null, false, '{}'),
  ('22222222-2222-4222-8222-222222222214', '11111111-1111-4111-8111-111111111106', 'Ifrane', 'AUI main gate', 'Marrakech', 'Guéliz',
   now() - interval '20 days', 3, 220, 'Fiat Tipo', 'Silver', null, false, '{}'),
  ('22222222-2222-4222-8222-222222222215', '11111111-1111-4111-8111-111111111108', 'Fès', 'Atlas', 'Ifrane', 'AUI main gate',
   now() - interval '6 days', 3, 40, 'Peugeot 208', 'Blue', null, false, '{}')
on conflict (id) do nothing;

-- --------------------------------------------------------------- bookings
insert into public.bookings (id, ride_id, passenger_id, seats, status) values
  ('33333333-3333-4333-8333-333333333301', '22222222-2222-4222-8222-222222222204', '11111111-1111-4111-8111-111111111101', 1, 'accepted'),
  ('33333333-3333-4333-8333-333333333302', '22222222-2222-4222-8222-222222222209', '11111111-1111-4111-8111-111111111101', 1, 'pending'),
  ('33333333-3333-4333-8333-333333333303', '22222222-2222-4222-8222-222222222211', '11111111-1111-4111-8111-111111111101', 1, 'accepted'),
  ('33333333-3333-4333-8333-333333333304', '22222222-2222-4222-8222-222222222212', '11111111-1111-4111-8111-111111111101', 1, 'accepted'),
  ('33333333-3333-4333-8333-333333333305', '22222222-2222-4222-8222-222222222210', '11111111-1111-4111-8111-111111111105', 1, 'pending'),
  ('33333333-3333-4333-8333-333333333306', '22222222-2222-4222-8222-222222222210', '11111111-1111-4111-8111-111111111107', 2, 'accepted'),
  ('33333333-3333-4333-8333-333333333307', '22222222-2222-4222-8222-222222222205', '11111111-1111-4111-8111-111111111109', 1, 'accepted'),
  ('33333333-3333-4333-8333-333333333308', '22222222-2222-4222-8222-222222222203', '11111111-1111-4111-8111-111111111105', 1, 'accepted'),
  ('33333333-3333-4333-8333-333333333309', '22222222-2222-4222-8222-222222222204', '11111111-1111-4111-8111-111111111107', 1, 'accepted'),
  ('33333333-3333-4333-8333-333333333310', '22222222-2222-4222-8222-222222222212', '11111111-1111-4111-8111-111111111109', 1, 'accepted'),
  ('33333333-3333-4333-8333-333333333311', '22222222-2222-4222-8222-222222222213', '11111111-1111-4111-8111-111111111107', 1, 'accepted'),
  ('33333333-3333-4333-8333-333333333312', '22222222-2222-4222-8222-222222222214', '11111111-1111-4111-8111-111111111105', 1, 'accepted'),
  ('33333333-3333-4333-8333-333333333313', '22222222-2222-4222-8222-222222222215', '11111111-1111-4111-8111-111111111103', 1, 'accepted')
on conflict (id) do nothing;

-- ---------------------------------------------------------------- reviews
insert into public.reviews (booking_id, reviewer_id, reviewee_id, reviewed_as, rating, comment) values
  ('33333333-3333-4333-8333-333333333304', '11111111-1111-4111-8111-111111111101', '11111111-1111-4111-8111-111111111102', 'driver', 5, 'Great trip down to Casa.'),
  ('33333333-3333-4333-8333-333333333310', '11111111-1111-4111-8111-111111111109', '11111111-1111-4111-8111-111111111102', 'driver', 5, 'Careful driver, good company, fair price.'),
  ('33333333-3333-4333-8333-333333333311', '11111111-1111-4111-8111-111111111107', '11111111-1111-4111-8111-111111111104', 'driver', 4, 'Great ride, just left a bit late.'),
  ('33333333-3333-4333-8333-333333333312', '11111111-1111-4111-8111-111111111105', '11111111-1111-4111-8111-111111111106', 'driver', 5, 'Marrakech and back, zero complaints.'),
  ('33333333-3333-4333-8333-333333333313', '11111111-1111-4111-8111-111111111103', '11111111-1111-4111-8111-111111111108', 'driver', 5, 'Reliable Sunday return, never missed one.'),
  ('33333333-3333-4333-8333-333333333303', '11111111-1111-4111-8111-111111111103', '11111111-1111-4111-8111-111111111101', 'passenger', 5, 'On time at the pickup, easy passenger.'),
  ('33333333-3333-4333-8333-333333333310', '11111111-1111-4111-8111-111111111102', '11111111-1111-4111-8111-111111111109', 'passenger', 5, 'Punctual and friendly.'),
  ('33333333-3333-4333-8333-333333333312', '11111111-1111-4111-8111-111111111106', '11111111-1111-4111-8111-111111111105', 'passenger', 5, null)
on conflict (booking_id, reviewer_id) do nothing;

-- ---------------------------------------------------------- ride requests
insert into public.ride_requests (id, rider_id, from_city, to_city, travel_date, time_of_day, seats, notes) values
  ('44444444-4444-4444-8444-444444444401', '11111111-1111-4111-8111-111111111109', 'Ifrane', 'Rabat', (now() + interval '2 days')::date, 'afternoon', 1, 'Finishing class at 2pm, flexible after that. Can share fuel and tolls.'),
  ('44444444-4444-4444-8444-444444444402', '11111111-1111-4111-8111-111111111105', 'Ifrane', 'Meknès', (now() + interval '3 days')::date, 'morning', 2, 'Me and my roommate, both with one small bag.'),
  ('44444444-4444-4444-8444-444444444403', '11111111-1111-4111-8111-111111111107', 'Casablanca', 'Ifrane', (now() + interval '4 days')::date, 'evening', 1, 'Coming back to campus after an appointment.')
on conflict (id) do nothing;
