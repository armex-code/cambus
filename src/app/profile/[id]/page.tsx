import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarFront, Users } from "lucide-react";
import { getStore } from "@/lib/data";
import { formatDate, memberSince } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import { Stars } from "@/components/stars";
import { VerifiedBadge } from "@/components/verified-badge";
import { Badge, Card, EmptyState } from "@/components/ui";

export const metadata: Metadata = { title: "Profile" };

function RatingBlock({
  icon: Icon,
  label,
  avg,
  count,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  avg: number | null;
  count: number;
}) {
  return (
    <div className="rounded-xl border border-line bg-paper-dim/50 p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        <Icon size={13} /> {label}
      </p>
      {avg === null ? (
        <p className="mt-2 text-sm text-ink-faint">No reviews yet</p>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <span className="font-display text-2xl font-semibold text-ink">
            {avg.toFixed(1)}
          </span>
          <div>
            <Stars rating={avg} />
            <p className="text-xs text-ink-faint">
              {count} review{count === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = getStore();
  const [profile, reviews] = await Promise.all([
    store.getPublicProfile(id),
    store.listReviewsFor(id),
  ]);
  if (!profile) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <Card className="p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <Avatar id={profile.id} name={profile.fullName} size="xl" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-semibold text-ink">
                {profile.fullName}
              </h1>
              <VerifiedBadge />
            </div>
            <p className="mt-1 text-sm text-ink-faint">
              On AUI Carpool since {memberSince(profile.createdAt)}
            </p>
            {profile.bio && (
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {profile.bio}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <RatingBlock
            icon={CarFront}
            label="As a driver"
            avg={profile.driverAvg}
            count={profile.driverCount}
          />
          <RatingBlock
            icon={Users}
            label="As a passenger"
            avg={profile.passengerAvg}
            count={profile.passengerCount}
          />
        </div>
      </Card>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">
        Reviews
      </h2>
      <div className="mt-4 space-y-4">
        {reviews.length === 0 ? (
          <EmptyState title="No reviews yet">
            Reviews appear after completed rides. Everyone starts somewhere.
          </EmptyState>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Avatar
                    id={review.reviewer.id}
                    name={review.reviewer.fullName}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {review.reviewer.fullName}
                    </p>
                    <p className="text-xs text-ink-faint">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="neutral">
                    as {review.reviewedAs === "driver" ? "a driver" : "a passenger"}
                  </Badge>
                  <Stars rating={review.rating} />
                </div>
              </div>
              {review.comment && (
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  “{review.comment}”
                </p>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
