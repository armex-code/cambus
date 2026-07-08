import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getStore } from "@/lib/data";
import { getCurrentProfile } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import { Card } from "@/components/ui";
import { ReviewForm } from "./review-form";

export const metadata: Metadata = { title: "Leave a review" };

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const store = getStore();
  const booking = await store.getBooking(bookingId);
  if (!booking) notFound();
  const ride = await store.getRide(booking.rideId);
  if (!ride) notFound();

  const isPassenger = booking.passengerId === profile.id;
  const isDriver = ride.driverId === profile.id;
  if (!isPassenger && !isDriver) notFound();
  if (booking.status !== "accepted") redirect("/trips");
  if (await store.hasReviewed(bookingId, profile.id)) redirect("/trips?reviewed=1");

  // Passenger reviews the driver; driver reviews the passenger.
  const reviewee = isPassenger
    ? ride.driver
    : (await store.listBookingsForRide(ride.id)).find(
        (b) => b.id === bookingId,
      )?.passenger;
  if (!reviewee) notFound();

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <Link
        href="/trips"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-pine-800"
      >
        <ArrowLeft size={15} /> Back to My Trips
      </Link>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <Avatar id={reviewee.id} name={reviewee.fullName} size="lg" />
          <div>
            <h1 className="font-display text-xl font-semibold text-ink">
              How was the ride with {reviewee.fullName.split(" ")[0]}?
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {ride.fromCity} → {ride.toCity} · {formatDate(ride.departureAt)} ·{" "}
              {isPassenger ? "your driver" : "your passenger"}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <ReviewForm bookingId={bookingId} />
        </div>
        <p className="mt-5 text-xs leading-relaxed text-ink-faint">
          Reviews are public on {reviewee.fullName.split(" ")[0]}'s profile and
          can't be edited, so rate the way you'd want to be rated.
        </p>
      </Card>
    </div>
  );
}
