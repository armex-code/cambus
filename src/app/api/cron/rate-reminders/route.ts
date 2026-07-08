import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Daily job (see vercel.json crons): finds rides that departed in the last
 * 24 hours and emails every driver and confirmed passenger who hasn't left
 * a review yet, inviting them to rate the trip.
 *
 * Needs Supabase mode plus:
 *   SUPABASE_SERVICE_ROLE_KEY  read emails past row-level security
 *   RESEND_API_KEY             send via resend.com
 *   EMAIL_FROM                 e.g. "AUI Carpool <rides@yourdomain.ma>"
 *   CRON_SECRET                shared secret so only Vercel Cron can call this
 * In demo mode (or with any variable missing) it reports itself skipped.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!url || !serviceKey || !resendKey || !from) {
    return NextResponse.json({
      skipped: "Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY and EMAIL_FROM to enable rating reminder emails.",
    });
  }

  const admin = createClient(url, serviceKey);
  const now = Date.now();
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();

  const { data: rides } = await admin
    .from("rides")
    .select("id, driver_id, from_city, to_city, departure_at")
    .eq("status", "active")
    .gte("departure_at", dayAgo)
    .lte("departure_at", new Date(now).toISOString());
  if (!rides || rides.length === 0) return NextResponse.json({ sent: 0 });

  const rideIds = rides.map((r) => r.id);
  const [{ data: bookings }, { data: reviews }] = await Promise.all([
    admin
      .from("bookings")
      .select("id, ride_id, passenger_id")
      .in("ride_id", rideIds)
      .eq("status", "accepted"),
    admin.from("reviews").select("booking_id, reviewer_id"),
  ]);
  if (!bookings || bookings.length === 0) return NextResponse.json({ sent: 0 });

  const reviewed = new Set(
    (reviews ?? []).map((r) => `${r.booking_id}:${r.reviewer_id}`),
  );
  const rideById = new Map(rides.map((r) => [r.id, r]));

  // One reminder per person per ride direction.
  const reminders: { userId: string; route: string }[] = [];
  for (const booking of bookings) {
    const ride = rideById.get(booking.ride_id);
    if (!ride) continue;
    const route = `${ride.from_city} to ${ride.to_city}`;
    if (!reviewed.has(`${booking.id}:${booking.passenger_id}`))
      reminders.push({ userId: booking.passenger_id, route });
    if (!reviewed.has(`${booking.id}:${ride.driver_id}`))
      reminders.push({ userId: ride.driver_id, route });
  }
  if (reminders.length === 0) return NextResponse.json({ sent: 0 });

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, full_name")
    .in("id", [...new Set(reminders.map((r) => r.userId))]);
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aui-carpool.vercel.app";

  let sent = 0;
  const seen = new Set<string>();
  for (const reminder of reminders) {
    const profile = profileById.get(reminder.userId);
    if (!profile?.email) continue;
    const key = `${profile.id}:${reminder.route}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const firstName = (profile.full_name ?? "").split(" ")[0] || "there";
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: profile.email,
        subject: `How was your ride ${reminder.route}?`,
        text: `Salam ${firstName},\n\nYour ride ${reminder.route} is done. Take 20 seconds to rate the person you shared it with. Honest ratings are what keep AUI Carpool safe for everyone.\n\nRate the trip here: ${site}/trips\n\nAUI Carpool`,
      }),
    });
    if (response.ok) sent += 1;
  }

  return NextResponse.json({ sent, candidates: reminders.length });
}
