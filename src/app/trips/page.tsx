import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Hourglass,
  Repeat,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { getStore } from "@/lib/data";
import { getCurrentProfile } from "@/lib/auth";
import {
  cancelBookingAction,
  cancelRideAction,
  respondBookingAction,
} from "@/app/actions";
import {
  cn,
  formatDay,
  formatMoney,
  formatRecurrence,
  formatTime,
  isPast,
  pluralize,
  whatsappLink,
} from "@/lib/utils";
import type {
  BookingWithPassenger,
  BookingWithRide,
  RideWithDriver,
} from "@/lib/types";
import { Avatar } from "@/components/avatar";
import { RatingLine } from "@/components/stars";
import { ContactReveal } from "@/components/contact-reveal";
import { Badge, Button, ButtonLink, EmptyState, Notice } from "@/components/ui";

export const metadata: Metadata = { title: "My trips" };

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "accepted":
      return (
        <Badge tone="green">
          <CheckCircle2 size={12} /> Confirmed
        </Badge>
      );
    case "pending":
      return (
        <Badge tone="amber">
          <Hourglass size={12} /> Waiting for driver
        </Badge>
      );
    case "declined":
      return (
        <Badge tone="red">
          <XCircle size={12} /> Declined
        </Badge>
      );
    default:
      return <Badge tone="neutral">Cancelled</Badge>;
  }
}

/* ---------------------------------------------------------- Riding tab */

async function RidingBookingCard({
  booking,
  userId,
  userName,
}: {
  booking: BookingWithRide;
  userId: string;
  userName: string;
}) {
  const store = getStore();
  const ride = booking.ride;
  const past = isPast(ride.departureAt);
  const contact =
    booking.status === "accepted"
      ? await store.getContactPhone(booking.id, userId)
      : null;
  const reviewed =
    booking.status === "accepted" && past
      ? await store.hasReviewed(booking.id, userId)
      : false;

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/rides/${ride.id}`}
          className="flex items-center gap-2 text-base font-semibold text-ink hover:text-pine-800"
        >
          {ride.fromCity}
          <ArrowRight size={15} className="text-pine-600" />
          {ride.toCity}
        </Link>
        <StatusBadge status={ride.status === "cancelled" ? "cancelled" : booking.status} />
      </div>
      <p className="mt-1.5 text-sm text-ink-soft">
        {formatDay(ride.departureAt)} · {formatTime(ride.departureAt)} ·{" "}
        {pluralize(booking.seats, "seat")} ·{" "}
        {formatMoney(ride.pricePerSeat * booking.seats)} in cash
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex items-center gap-2.5">
          <Avatar id={ride.driver.id} name={ride.driver.fullName} size="sm" />
          <div>
            <Link
              href={`/profile/${ride.driver.id}`}
              className="text-sm font-medium text-ink hover:text-pine-800"
            >
              {ride.driver.fullName}
            </Link>
            <RatingLine
              avg={ride.driver.driverAvg}
              count={ride.driver.driverCount}
              label="rating"
              className="block"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {contact && !past && (
            <ContactReveal
              compact
              phone={contact.phone}
              whatsappHref={whatsappLink(
                contact.phone,
                `Salam ${contact.name.split(" ")[0]}! It's ${userName} from AUI Carpool, about the ${ride.fromCity} → ${ride.toCity} ride.`,
              )}
              whatsappLabel="WhatsApp driver"
            />
          )}
          {!past && (booking.status === "pending" || booking.status === "accepted") && ride.status === "active" && (
            <form action={cancelBookingAction}>
              <input type="hidden" name="bookingId" value={booking.id} />
              <Button variant="danger" size="sm" type="submit">
                Cancel seat
              </Button>
            </form>
          )}
          {past && booking.status === "accepted" && !reviewed && (
            <ButtonLink href={`/review/${booking.id}`} size="sm">
              <Star size={14} /> Rate this driver
            </ButtonLink>
          )}
          {past && reviewed && (
            <Badge tone="green">
              <Star size={12} /> Reviewed
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- Driving tab */

async function DrivingRideCard({
  ride,
  userId,
  userName,
}: {
  ride: RideWithDriver;
  userId: string;
  userName: string;
}) {
  const store = getStore();
  const bookings = await store.listBookingsForRide(ride.id);
  const past = isPast(ride.departureAt);
  const pending = bookings.filter((b) => b.status === "pending");
  const accepted = bookings.filter((b) => b.status === "accepted");

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/rides/${ride.id}`}
          className="flex items-center gap-2 text-base font-semibold text-ink hover:text-pine-800"
        >
          {ride.fromCity}
          <ArrowRight size={15} className="text-pine-600" />
          {ride.toCity}
        </Link>
        <div className="flex items-center gap-2">
          {ride.isRecurring && (
            <Badge tone="amber">
              <Repeat size={12} /> {formatRecurrence(ride.recurrenceDays)}
            </Badge>
          )}
          {ride.status === "cancelled" ? (
            <Badge tone="red">Cancelled</Badge>
          ) : past ? (
            <Badge tone="neutral">Departed</Badge>
          ) : (
            <Badge tone="green">
              <Users size={12} /> {pluralize(ride.seatsLeft, "seat")} left
            </Badge>
          )}
        </div>
      </div>
      <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} /> {formatDay(ride.departureAt)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} /> {formatTime(ride.departureAt)}
        </span>
        <span>{formatMoney(ride.pricePerSeat)} / seat</span>
      </p>

      {pending.length > 0 && ride.status === "active" && !past && (
        <div className="mt-4 space-y-3 rounded-xl bg-saffron-100/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-saffron-700">
            {pluralize(pending.length, "seat request")} waiting for you
          </p>
          {pending.map((b) => (
            <PassengerRow key={b.id} booking={b} showActions />
          ))}
        </div>
      )}

      {accepted.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-line pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Confirmed passengers
          </p>
          {accepted.map((b) => (
            <AcceptedPassengerRow
              key={b.id}
              booking={b}
              ride={ride}
              userId={userId}
              userName={userName}
              past={past}
            />
          ))}
        </div>
      )}

      {bookings.length === 0 && !past && ride.status === "active" && (
        <p className="mt-4 rounded-xl bg-paper-dim/70 px-4 py-3 text-sm text-ink-faint">
          No requests yet. They'll show up here.
        </p>
      )}

      {!past && ride.status === "active" && (
        <div className="mt-4 flex justify-end border-t border-line pt-4">
          <form action={cancelRideAction}>
            <input type="hidden" name="rideId" value={ride.id} />
            <Button variant="danger" size="sm" type="submit">
              Cancel this ride
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

async function AcceptedPassengerRow({
  booking,
  ride,
  userId,
  userName,
  past,
}: {
  booking: BookingWithPassenger;
  ride: RideWithDriver;
  userId: string;
  userName: string;
  past: boolean;
}) {
  const store = getStore();
  const contact = await store.getContactPhone(booking.id, userId);
  const reviewed = past ? await store.hasReviewed(booking.id, userId) : false;
  return (
    <PassengerRow booking={booking}>
      {contact && !past && (
        <ContactReveal
          compact
          phone={contact.phone}
          whatsappHref={whatsappLink(
            contact.phone,
            `Salam ${contact.name.split(" ")[0]}! ${userName} here, your driver for ${ride.fromCity} → ${ride.toCity} on AUI Carpool.`,
          )}
          whatsappLabel="WhatsApp"
        />
      )}
      {past && !reviewed && (
        <ButtonLink href={`/review/${booking.id}`} variant="secondary" size="sm">
          <Star size={13} /> Rate passenger
        </ButtonLink>
      )}
      {past && reviewed && (
        <Badge tone="green">
          <Star size={12} /> Reviewed
        </Badge>
      )}
    </PassengerRow>
  );
}

function PassengerRow({
  booking,
  showActions = false,
  children,
}: {
  booking: BookingWithPassenger;
  showActions?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <Avatar id={booking.passenger.id} name={booking.passenger.fullName} size="sm" />
        <div className="min-w-0">
          <Link
            href={`/profile/${booking.passenger.id}`}
            className="block truncate text-sm font-medium text-ink hover:text-pine-800"
          >
            {booking.passenger.fullName}
          </Link>
          <span className="text-xs text-ink-faint">
            {pluralize(booking.seats, "seat")} ·{" "}
          </span>
          <RatingLine
            avg={booking.passenger.passengerAvg}
            count={booking.passenger.passengerCount}
            label="passenger rating"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showActions ? (
          <>
            <form action={respondBookingAction}>
              <input type="hidden" name="bookingId" value={booking.id} />
              <input type="hidden" name="decision" value="accepted" />
              <Button size="sm" type="submit">
                Accept
              </Button>
            </form>
            <form action={respondBookingAction}>
              <input type="hidden" name="bookingId" value={booking.id} />
              <input type="hidden" name="decision" value="declined" />
              <Button variant="secondary" size="sm" type="submit">
                Decline
              </Button>
            </form>
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Page */

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; reviewed?: string }>;
}) {
  const { tab, reviewed } = await searchParams;
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const store = getStore();
  const driving = tab === "driving";
  const [bookings, rides] = await Promise.all([
    store.listBookingsByPassenger(profile.id),
    store.listRidesByDriver(profile.id),
  ]);

  const pendingRequests = await Promise.all(
    rides
      .filter((r) => r.status === "active" && !isPast(r.departureAt))
      .map(async (r) => {
        const rideBookings = await store.listBookingsForRide(r.id);
        return rideBookings.filter((b) => b.status === "pending").length;
      }),
  );
  const pendingCount = pendingRequests.reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">My trips</h1>

      {reviewed && (
        <div className="mt-4">
          <Notice>Review posted. Thanks for keeping ratings honest.</Notice>
        </div>
      )}

      <div className="mt-6 flex gap-1 rounded-xl border border-line bg-paper-dim/70 p-1">
        {[
          { key: "riding", label: `Riding (${bookings.length})`, href: "/trips" },
          {
            key: "driving",
            label: `Driving (${rides.length})${pendingCount > 0 ? ` · ${pendingCount} new` : ""}`,
            href: "/trips?tab=driving",
          },
        ].map(({ key, label, href }) => (
          <Link
            key={key}
            href={href}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors",
              (key === "driving") === driving
                ? "bg-white text-pine-900 shadow-card"
                : "text-ink-soft hover:text-ink",
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {driving ? (
          rides.length === 0 ? (
            <EmptyState
              title="You haven't offered any rides yet"
              action={<ButtonLink href="/offer">Offer your first ride</ButtonLink>}
            >
              Got a car on campus? Your empty seats are someone's way home,
              and your fuel money back.
            </EmptyState>
          ) : (
            rides.map((ride) => (
              <DrivingRideCard
                key={ride.id}
                ride={ride}
                userId={profile.id}
                userName={profile.fullName}
              />
            ))
          )
        ) : bookings.length === 0 ? (
          <EmptyState
            title="No trips booked yet"
            action={<ButtonLink href="/rides">Browse rides</ButtonLink>}
          >
            Find a ride out of Ifrane and request a seat. Your bookings and
            their status will live here.
          </EmptyState>
        ) : (
          bookings.map((booking) => (
            <RidingBookingCard
              key={booking.id}
              booking={booking}
              userId={profile.id}
              userName={profile.fullName}
            />
          ))
        )}
      </div>
    </div>
  );
}
