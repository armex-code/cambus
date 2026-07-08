import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Data protection policy" };

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. What we collect",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Your @aui.ma email address, used to verify that you belong to the AUI community and to sign you in.</li>
        <li>Your name, phone number and the short bio you choose to write.</li>
        <li>The rides, requests, bookings and reviews you create on the platform.</li>
        <li>Basic technical data needed to run the service, such as session cookies.</li>
      </ul>
    ),
  },
  {
    title: "2. What we use it for",
    body: (
      <>
        Only to run the service: verifying accounts, showing rides and
        profiles, connecting drivers with passengers once a booking is
        accepted, displaying ratings, and sending service emails such as
        sign-in codes and post-trip rating reminders. We do not sell personal
        data, we do not share it with advertisers, and we do not use it for
        anything unrelated to carpooling.
      </>
    ),
  },
  {
    title: "3. Who sees what",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Public to signed-in members: your name, bio, ratings and reviews, and the rides or requests you post.</li>
        <li>Never public: your email address and phone number.</li>
        <li>Your phone number is shared once, privately, with the other party of a booking after the driver accepts it. That is the only time it leaves your profile.</li>
      </ul>
    ),
  },
  {
    title: "4. Where it lives",
    body: (
      <>
        Data is stored with our hosting and database providers (Vercel and
        Supabase), protected by access rules so that each member can only read
        what the previous section describes. Payments happen in cash between
        members, so no payment or card data exists on the platform at all.
      </>
    ),
  },
  {
    title: "5. Your rights",
    body: (
      <>
        In line with Moroccan law 09-08 on the protection of personal data,
        you can ask to see the data we hold about you, correct it, or have
        your account and data deleted. Most of it you can edit yourself from
        your profile settings. For anything else, one email is enough.
      </>
    ),
  },
  {
    title: "6. Cookies",
    body: (
      <>
        We use only the cookies needed to keep you signed in. No tracking
        cookies, no advertising cookies, no analytics that follow you around
        the web.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Data protection policy
      </h1>
      <p className="mt-2 text-sm text-ink-faint">Last updated: July 2026</p>
      <div className="mt-8 space-y-8">
        {SECTIONS.map(({ title, body }) => (
          <section key={title}>
            <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
            <div className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</div>
          </section>
        ))}
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">7. Contact</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            For any request about your data, write to{" "}
            <a href="mailto:carpool.aui@gmail.com" className="font-medium text-pine-800 underline">
              carpool.aui@gmail.com
            </a>
            . The general rules of the platform are in the{" "}
            <Link href="/terms" className="font-medium text-pine-800 underline">
              general conditions
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
