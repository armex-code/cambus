import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getStore } from "@/lib/data";
import { CITIES } from "@/lib/cities";
import { RideCard } from "@/components/ride-card";
import { ButtonLink, EmptyState } from "@/components/ui";

export const metadata: Metadata = { title: "Find a ride" };

export default async function RidesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; date?: string }>;
}) {
  const params = await searchParams;
  const filters = {
    from: params.from || undefined,
    to: params.to || undefined,
    date: params.date || undefined,
  };
  const rides = await getStore().listRides(filters);
  const filtered = Boolean(filters.from || filters.to || filters.date);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Find a ride
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Every driver has a verified @aui.ma email. Seats are paid in cash, in the car.
          </p>
        </div>
        <ButtonLink href="/requests/new" variant="secondary" size="sm">
          Can't find one? Post a request
        </ButtonLink>
      </div>

      <form
        action="/rides"
        className="mt-6 grid gap-3 rounded-2xl border border-line bg-white p-4 shadow-card sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
      >
        <div>
          <label htmlFor="from" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            From
          </label>
          <select
            id="from"
            name="from"
            defaultValue={filters.from ?? ""}
            className="w-full rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm"
          >
            <option value="">Anywhere</option>
            {CITIES.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="to" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            To
          </label>
          <select
            id="to"
            name="to"
            defaultValue={filters.to ?? ""}
            className="w-full rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm"
          >
            <option value="">Anywhere</option>
            {CITIES.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Date
          </label>
          <input
            id="date"
            type="date"
            name="date"
            defaultValue={filters.date ?? ""}
            className="w-full rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine-700 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-pine-800"
        >
          <Search size={16} />
          Search
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {rides.length === 0 ? (
          <EmptyState
            title={filtered ? "No rides match that search" : "No upcoming rides yet"}
            action={
              <div className="flex flex-wrap justify-center gap-3">
                {filtered && (
                  <ButtonLink href="/rides" variant="secondary" size="sm">
                    Clear filters
                  </ButtonLink>
                )}
                <ButtonLink href="/requests/new" size="sm">
                  Post a ride request
                </ButtonLink>
              </div>
            }
          >
            Post a request so drivers heading that way can find you, or check
            back closer to the weekend when most rides appear.
          </EmptyState>
        ) : (
          <>
            <p className="text-sm text-ink-faint">
              {rides.length} upcoming {rides.length === 1 ? "ride" : "rides"}
              {filtered && " for this search"}
            </p>
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
