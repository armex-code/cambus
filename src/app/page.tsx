import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  MapPin,
  MessageCircle,
  Search,
  Star,
} from "lucide-react";
import { CITIES, POPULAR_ROUTES, priceHint } from "@/lib/cities";
import { ButtonLink } from "@/components/ui";
import { Photo } from "@/components/photo";
import { ZelligePattern } from "@/components/pattern";

const STEPS: [string, string][] = [
  ["Find or offer a ride", "Search by route and date, or post your car's empty seats in under a minute. Every ride starts or ends in Ifrane."],
  ["Driver approves, numbers swap", "The driver accepts your request. Only then do you two get each other's number, straight into WhatsApp."],
  ["Cash in the car, rate after", "No cards, no fees. Pay the driver their share, then rate each other to keep the community honest."],
];

const SAFETY_POINTS = [
  { icon: BadgeCheck, title: "@aui.ma only", body: "No account without a live AUI inbox. Students, staff and faculty, nobody else." },
  { icon: Star, title: "Ratings both ways", body: "Drivers and passengers rate each other after every trip, and reputations are public." },
  { icon: MessageCircle, title: "Numbers stay private", body: "Phones are shared only between the two of you, and only after a booking is accepted." },
];

const FAQ: [string, string][] = [
  ["How much does it cost to use?", "Nothing. The platform is free and takes no commission. The price on a ride goes to the driver, in cash, to cover fuel and tolls."],
  ["I don't have a car. Is this still for me?", "Yes, most people here are passengers. You can also post a ride request so drivers heading your way can find you."],
  ["How do I know a driver is trustworthy?", "Every account belongs to a verified @aui.ma inbox, and riders rate each other after every trip. Check the profile before you book."],
  ["What if my plans change?", "Cancel your seat from My Trips as early as you can. People count on you, and no-shows sink your rating."],
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-pine-900">
        <ZelligePattern className="text-pine-700/30" id="hero-zellige" />
        <div
          aria-hidden
          className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-pine-700/40 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-pine-600/60 bg-pine-800/60 px-3.5 py-1.5 text-xs font-medium text-pine-100">
                <GraduationCap size={14} />
                For the AUI community, verified by @aui.ma email
              </p>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-paper sm:text-5xl">
                Leaving Ifrane?
                <br />
                <span className="text-saffron-300">Ride with your campus.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-pine-200">
                Share rides between Ifrane and the rest of Morocco with people
                from AUI. Split the fuel in cash and skip the grand taxi
                scramble.
              </p>
            </div>
            <Photo
              src="/images/campus.jpg"
              alt="Al Akhawayn University campus in Ifrane"
              className="hidden w-full rounded-3xl border border-pine-700/60 object-cover shadow-lift lg:block lg:aspect-[4/3]"
            />
          </div>

          <form
            action="/rides"
            className="mt-9 grid gap-3 rounded-2xl border border-pine-700 bg-paper p-4 shadow-lift sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
          >
            <div className="min-w-0">
              <label htmlFor="from" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Leaving from
              </label>
              <select
                id="from"
                name="from"
                defaultValue="Ifrane"
                className="w-full min-w-0 rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="">Anywhere</option>
                {CITIES.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label htmlFor="to" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Going to
              </label>
              <select
                id="to"
                name="to"
                defaultValue=""
                className="w-full min-w-0 rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="">Anywhere</option>
                {CITIES.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label htmlFor="date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Date
              </label>
              <input
                id="date"
                type="date"
                name="date"
                className="w-full min-w-0 rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine-700 px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-pine-800"
            >
              <Search size={16} />
              Search rides
            </button>
          </form>
        </div>
      </section>

      {/* Popular routes */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              The routes everyone takes
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Typical prices per seat, usually less than a grand taxi.
            </p>
          </div>
          <ButtonLink href="/rides" variant="ghost" className="hidden shrink-0 sm:inline-flex">
            All rides <ArrowRight size={16} />
          </ButtonLink>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_ROUTES.map(({ from, to, note }) => {
            const hint = priceHint(from, to);
            return (
              <Link
                key={`${from}-${to}`}
                href={`/rides?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
                className="group rounded-2xl border border-line bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-pine-300 hover:shadow-lift"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <MapPin size={15} className="text-pine-600" />
                  {from}
                  <ArrowRight size={14} className="text-ink-faint transition-transform group-hover:translate-x-0.5" />
                  {to}
                </div>
                <p className="mt-2 text-xs text-ink-faint">{note}</p>
                {hint && (
                  <p className="mt-4 font-display text-lg font-semibold text-pine-800">
                    {hint.low}–{hint.high} MAD
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-paper-dim/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-center">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                How it works
              </h2>
              <ol className="mt-8 space-y-7">
                {STEPS.map(([title, body], i) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine-700 font-display text-sm font-semibold text-paper">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink">{title}</h3>
                      <p className="mt-1 max-w-lg text-sm leading-relaxed text-ink-soft">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-4">
              <Photo
                src="/images/car.jpg"
                alt="AUI members sharing a ride out of Ifrane"
                className="w-full rounded-3xl border border-line object-cover shadow-card sm:aspect-[16/10]"
              />
              <Photo
                src="/images/booking.jpg"
                alt="Booking a seat from a phone"
                className="ml-auto w-3/4 rounded-3xl border border-line object-cover shadow-card sm:aspect-[16/9]"
              />
            </div>
          </div>

          <div className="relative mt-12 overflow-hidden rounded-3xl bg-pine-900 px-6 py-10 sm:px-10">
            <ZelligePattern className="text-pine-700/30" id="safety-zellige" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-sm">
                <h2 className="font-display text-2xl font-semibold text-paper">
                  Built on trust, not luck.
                </h2>
                <ButtonLink href="/safety" variant="secondary" size="sm" className="mt-5">
                  The safety rules <ArrowRight size={15} />
                </ButtonLink>
              </div>
              <ul className="grid flex-1 gap-4 sm:grid-cols-3">
                {SAFETY_POINTS.map(({ icon: Icon, title, body }) => (
                  <li key={title}>
                    <Icon size={19} className="text-saffron-300" />
                    <h3 className="mt-2 text-sm font-semibold text-paper">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-pine-200">{body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Fair questions
        </h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white shadow-card">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group px-5 py-4 open:bg-paper-dim/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {q}
                <span className="text-ink-faint transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/rides" size="lg">
            Find a ride
          </ButtonLink>
          <ButtonLink href="/offer" variant="secondary" size="lg">
            Offer a ride
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
