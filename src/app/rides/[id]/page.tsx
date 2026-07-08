import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock,
  Hourglass,
  Repeat,
  Users,
} from "lucide-react";
import { getStore } from "@/lib/data";
import { getCurrentProfile } from "@/lib/auth";
import {
  formatDateLong,
  formatMoney,
  formatRecurrence,
  formatTime,
  isPast,
  memberSince,
  pluralize,
  whatsappLink,
} from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import { RatingLine } from "@/components/stars";
import { RouteLine } from "@/components/route-line";
import { VerifiedBadge } from "@/components/verified-badge";
import { Badge, ButtonLink, Card, Notice } from "@/components/ui";
import { ContactReveal } from "@/components/contact-reveal";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = { title: "Ride details" };

export default async function RideDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ published?: string }>;
}) {
  const { id } = await params;
  const { published } = await searchParams;
  const store = getStore();
  const [ride, profile] = await Promise.all([
    store.getRide(id),
    getCurrentProfile(),
  ]);
  if (!ride) notFound();

  const departed = isPast(ride.departureAt);
  const isDriver = profile?.id === ride.driverId;
  const booking =
    profile && !isDriver
      ? await store.getBookingForPassenger(ride.id, profile.id)
      : null;
  const contact =
    booking?.status === "accepted" && profile
      ? await store.getContactPhone(booking.id, profile.id)
      : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href="/rides"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-pine-800"
      >
        <ArrowLeft size={15} /> All rides
      </Link>

      {published && (
        <div className="mt-4">
          <Notice>
            Your ride is live. Booking requests will appear in{" "}
            <Link href="/trips" className="font-semibold underline">
              My Trips
            </Link>
            .
          </Notice>
        </div>
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Main column */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="green">
                <CalendarDays size={12} />
                {formatDateLong(ride.departureAt)}
              </Badge>
              <Badge tone="neutral">
                <Clock size={12} />
                {formatTime(ride.departureAt)}
              </Badge>
              {ride.isRecurring && (
                <Badge tone="amber">
                  <Repeat size={12} />
                  {formatRecurrence(ride.recurrenceDays)}
                </Badge>
              )}
              {ride.status === "cancelled" && <Badge tone="red">Cancelled</Badge>}
              {departed && ride.status === "active" && (
                <Badge tone="neutral">Departed</Badge>
              )}
            </div>
            <RouteLine
              from={ride.fromCity}
              to={ride.toCity}
              fromDetail={ride.fromDetail}
              toDetail={ride.toDetail}
              className="mt-6"
            />
            {ride.notes && (
              <p className="mt-6 whitespace-pre-line rounded-xl bg-paper-dim/70 p-4 text-sm leading-relaxed text-ink-soft">
                {ride.notes}
              </p>
            )}
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
                  <Users size={13} /> Seats
                </dt>
                <dd className="mt-1 font-semibold text-ink">
                  {ride.seatsLeft} of {ride.seatsTotal} free
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
                  <Banknote size={13} /> Payment
                </dt>
                <dd className="mt-1 font-semibold text-ink">Cash in the car</dd>
              </div>
              {ride.carModel && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
                    <CarFront size={13} /> Car
                  </dt>
                  <dd className="mt-1 font-semibold text-ink">
                    {ride.carColor ? `${ride.carColor} ` : ""}
                    {ride.carModel}
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Driver */}
          <Card className="p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Your driver
            </h2>
            <div className="mt-4 flex items-start gap-4">
              <Avatar id={ride.driver.id} name={ride.driver.fullName} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/profile/${ride.driver.id}`}
                    className="font-display text-lg font-semibold text-ink hover:text-pine-800"
                  >
                    {ride.driver.fullName}
                  </Link>
                  <VerifiedBadge />
                </div>
                <RatingLine
                  avg={ride.driver.driverAvg}
                  count={ride.driver.driverCount}
                  label="driver rating"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-ink-faint">
                  On AUI Carpool since {memberSince(ride.driver.createdAt)}
                </p>
                {ride.driver.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {ride.driver.bio}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Booking column */}
        <div>
          <Card className="sticky top-20 p-6">
            <p className="font-display text-3xl font-semibold text-pine-800">
              {formatMoney(ride.pricePerSeat)}
              <span className="ml-1 text-sm font-normal text-ink-faint">
                per seat
              </span>
            </p>

            <div className="mt-5">
              {!profile ? (
                <div className="space-y-3">
                  <ButtonLink href="/login" size="lg" className="w-full">
                    Sign in to request a seat
                  </ButtonLink>
                  <p className="text-center text-xs text-ink-faint">
                    @aui.ma accounts only.
                  </p>
                </div>
              ) : isDriver ? (
                <div className="space-y-3">
                  <Notice>This is your ride.</Notice>
                  <ButtonLink href="/trips?tab=driving" variant="secondary" className="w-full">
                    Manage bookings in My Trips
                  </ButtonLink>
                </div>
              ) : ride.status === "cancelled" ? (
                <Notice>This ride was cancelled by the driver.</Notice>
              ) : departed ? (
                <Notice>This ride has already departed.</Notice>
              ) : booking?.status === "accepted" ? (
                <div className="space-y-3">
                  <p className="flex items-center gap-2 rounded-xl bg-pine-50 px-4 py-3 text-sm font-medium text-pine-900">
                    <CheckCircle2 size={17} className="shrink-0 text-pine-700" />
                    You're in. {pluralize(booking.seats, "seat")} confirmed.
                  </p>
                  {contact && (
                    <ContactReveal
                      phone={contact.phone}
                      whatsappHref={whatsappLink(
                        contact.phone,
                        `Salam ${contact.name.split(" ")[0]}! It's ${profile.fullName} from AUI Carpool, about the ${ride.fromCity} → ${ride.toCity} ride.`,
                      )}
                      whatsappLabel={`WhatsApp ${contact.name.split(" ")[0]}`}
                    />
                  )}
                  <p className="text-center text-xs text-ink-faint">
                    Agree on the exact pickup spot, and have the cash ready.
                  </p>
                </div>
              ) : booking?.status === "pending" ? (
                <div className="space-y-3">
                  <p className="flex items-center gap-2 rounded-xl bg-saffron-100 px-4 py-3 text-sm font-medium text-saffron-700">
                    <Hourglass size={16} className="shrink-0" />
                    Request sent. Waiting for the driver.
                  </p>
                  <p className="text-center text-xs text-ink-faint">
                    You'll see the answer in My Trips. Numbers are exchanged
                    once accepted.
                  </p>
                </div>
              ) : ride.seatsLeft === 0 ? (
                <Notice>This ride is full. Check other departures or post a request.</Notice>
              ) : (
                <BookingForm rideId={ride.id} maxSeats={Math.min(ride.seatsLeft, 4)} />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
