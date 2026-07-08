import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { getStore } from "@/lib/data";
import { getCurrentProfile } from "@/lib/auth";
import { closeRequestAction } from "@/app/actions";
import { formatDate, memberSince } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import { RatingLine } from "@/components/stars";
import { VerifiedBadge } from "@/components/verified-badge";
import { Badge, Button, ButtonLink, EmptyState, Notice } from "@/components/ui";

export const metadata: Metadata = { title: "Ride requests" };

const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  flexible: "Flexible time",
};

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ posted?: string }>;
}) {
  const { posted } = await searchParams;
  const [requests, profile] = await Promise.all([
    getStore().listRequests(),
    getCurrentProfile(),
  ]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Ride requests
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            People looking for a seat. Driving one of these routes? Post the
            ride and they'll book it.
          </p>
        </div>
        <ButtonLink href="/requests/new" size="sm">
          Post a request
        </ButtonLink>
      </div>

      {posted && (
        <div className="mt-5">
          <Notice>
            Your request is up. When a driver posts a matching ride, book it
            from the rides page, and keep an eye on your WhatsApp.
          </Notice>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {requests.length === 0 ? (
          <EmptyState
            title="No open requests right now"
            action={
              <ButtonLink href="/requests/new" size="sm">
                Be the first to post one
              </ButtonLink>
            }
          >
            Need a seat somewhere? Post your route and date so drivers heading
            that way can plan around you.
          </EmptyState>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-line bg-white p-5 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar id={request.rider.id} name={request.rider.fullName} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/profile/${request.rider.id}`}
                        className="truncate text-sm font-semibold text-ink hover:text-pine-800"
                      >
                        {request.rider.fullName}
                      </Link>
                      <VerifiedBadge />
                    </div>
                    <RatingLine
                      avg={request.rider.passengerAvg}
                      count={request.rider.passengerCount}
                      label="passenger rating"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="green">
                    <CalendarDays size={12} />
                    {formatDate(request.travelDate)} · {TIME_LABELS[request.timeOfDay]}
                  </Badge>
                  <Badge tone="neutral">
                    <Users size={12} />
                    {request.seats} {request.seats === 1 ? "seat" : "seats"}
                  </Badge>
                </div>
              </div>

              <p className="mt-4 flex items-center gap-2 text-base font-semibold text-ink">
                {request.fromCity}
                <ArrowRight size={16} className="text-pine-600" />
                {request.toCity}
              </p>
              {request.notes && (
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {request.notes}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <p className="text-xs text-ink-faint">
                  Member since {memberSince(request.rider.createdAt)}
                </p>
                {profile?.id === request.riderId ? (
                  <form action={closeRequestAction}>
                    <input type="hidden" name="requestId" value={request.id} />
                    <Button variant="secondary" size="sm" type="submit">
                      Close my request
                    </Button>
                  </form>
                ) : (
                  <ButtonLink
                    href={`/offer?from=${encodeURIComponent(request.fromCity)}&to=${encodeURIComponent(request.toCity)}`}
                    variant="secondary"
                    size="sm"
                  >
                    I can drive this <ArrowRight size={14} />
                  </ButtonLink>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
