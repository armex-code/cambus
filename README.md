# AUI Carpool

Carpooling for the Al Akhawayn University community (students, staff and
faculty): rides between Ifrane and the rest of Morocco, shared inside the
campus community. Every trip starts or ends in Ifrane.

**Why it's different from a taxi or a Facebook post:**

- **AUI community only.** Accounts require a verified `@aui.ma` email
  (one-time code, no passwords).
- **Trust built in.** Two-way ratings: passengers rate drivers, drivers rate
  passengers.
- **Cheap by design.** Drivers price to split fuel, not to profit — the app
  shows fair-price hints per route.
- **Cash, in the car.** The platform never touches money.
- **Privacy.** Phone numbers are exchanged (via WhatsApp deep link) only after
  a driver accepts a booking.

## Features

- Browse & filter rides (origin, destination, date)
- Offer rides, including **weekly recurring** rides (e.g. every Friday to Casa)
- Request seats; drivers accept/decline each passenger
- **Ride requests** board — passengers post routes they need, drivers answer
- Post-trip **reviews** in both directions, shown on public profiles
- Driver dashboard (accept/decline, WhatsApp passengers, cancel rides) and
  passenger dashboard (booking status, WhatsApp driver, cancel seat)
- Rating reminder emails after each trip (Vercel Cron + Resend, optional)
- General conditions and data protection policy pages (Moroccan law 09-08)
- Fully responsive with a mobile tab bar

## Stack

- [Next.js](https://nextjs.org) (App Router, React Server Components, Server
  Actions) + TypeScript
- Tailwind CSS v4
- Supabase (Postgres + Auth) — or a zero-config **demo mode**
- Deployed on Vercel

The UI talks to a single `DataStore` interface (`src/lib/data/store.ts`) with
two implementations, so the persistence layer is swappable and a future React
Native app can reuse all domain logic:

| Mode | When | Data |
| --- | --- | --- |
| **Demo** | No Supabase env vars set | Seeded in-memory sample data; sign in with any `@aui.ma` email, code `424242` (use `demo@aui.ma` for a pre-filled account) |
| **Production** | Supabase env vars set | Real Postgres with row-level security; sign-in codes are emailed |

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you're in demo mode.

## Going live with Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/001_init.sql`.
3. In **Authentication → Email Templates → Magic Link**, make sure the
   template includes the `{{ .Token }}` variable so users receive the 6-digit
   code (e.g. “Your AUI Carpool code is `{{ .Token }}`”).
4. Copy the project URL and anon key (Project Settings → API) into env vars —
   locally in `.env.local`, and on Vercel under Project → Settings →
   Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. Redeploy. The app detects the vars and switches from demo data to Supabase
   automatically.

Want to experiment with a real database but fake content first? After your
first sign-in, run `supabase/seed.sql` in the SQL editor. It posts sample
rides and a request under your account so every screen has data. Delete the
rows (or reset the project) when you go live for real.

### Rating reminder emails

`vercel.json` schedules a daily job (`/api/cron/rate-reminders`) that emails
every driver and confirmed passenger of the last 24 hours who hasn't left a
review yet. It stays dormant until you set, in Vercel env vars:
`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` (free at resend.com),
`EMAIL_FROM`, `CRON_SECRET` and `NEXT_PUBLIC_SITE_URL`. See `.env.example`.

### Homepage photos

Upload `campus.jpg`, `car.jpg` and `booking.jpg` to `public/images/` and the
homepage picks them up. Details in `public/images/README.md`.

Security model: `@aui.ma`-only sign-up is enforced in the server action *and*
by a database trigger; phone numbers live behind a security-definer RPC that
only releases them to the two parties of an accepted booking; all tables have
row-level security.

## Project layout

```
src/
  app/            pages (App Router) + server actions
  components/     UI kit (buttons, cards, ride card, header…)
  lib/
    data/         DataStore interface + demo & Supabase implementations
    supabase/     SSR client factory
    auth.ts       session helpers (demo cookie / Supabase auth)
    cities.ts     city list + fair-price hints per route
supabase/
  migrations/     full schema: tables, views, RPC, RLS policies
```
