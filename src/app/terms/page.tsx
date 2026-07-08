import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "General conditions" };

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. What AUI Carpool is",
    body: (
      <>
        AUI Carpool is a notice board that connects members of the Al Akhawayn
        University community who want to share car trips that start or end in
        Ifrane. The platform is an independent initiative run by students. It
        is not operated, endorsed or supervised by Al Akhawayn University, and
        it is not a transport company, a taxi service or a travel agency.
      </>
    ),
  },
  {
    title: "2. Who can use it",
    body: (
      <>
        Accounts are reserved for people with an active @aui.ma email address:
        students, staff, faculty and other members of the AUI community. You
        must be at least 18 years old. One account per person, and you are
        responsible for what happens under your account.
      </>
    ),
  },
  {
    title: "3. Rides and payment",
    body: (
      <>
        Drivers and passengers agree on the trip between themselves. The price
        shown on a ride is a cost sharing contribution set by the driver and
        paid in cash, directly in the car. The platform never collects money,
        never takes a commission and never holds funds. Drivers must hold a
        valid driving licence, insurance and a roadworthy vehicle, and should
        price rides to share costs rather than to make a profit.
      </>
    ),
  },
  {
    title: "4. Your responsibilities",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Show up on time, or cancel from the app as early as you can.</li>
        <li>Give accurate information in your profile, rides and requests.</li>
        <li>Rate honestly after each trip.</li>
        <li>Treat other members with respect, in the car and in messages.</li>
        <li>Follow Moroccan traffic law: seatbelts, speed limits, no phone while driving.</li>
      </ul>
    ),
  },
  {
    title: "5. Our role and liability",
    body: (
      <>
        We provide the listing service in good faith and work to keep the
        community safe through email verification and ratings. We do not
        organise the trips, we are not a party to the agreement between driver
        and passenger, and we cannot guarantee the behaviour of any member,
        the condition of any vehicle or the outcome of any trip. You travel at
        your own responsibility. To the extent permitted by Moroccan law, the
        platform and the people who run it accept no liability for damages
        arising from rides arranged through it.
      </>
    ),
  },
  {
    title: "6. Account removal",
    body: (
      <>
        We can suspend or remove accounts that break these conditions, receive
        serious or repeated reports, or misuse the platform. You can stop
        using the service at any time and ask us to delete your account and
        data by writing to the contact address below.
      </>
    ),
  },
  {
    title: "7. Changes",
    body: (
      <>
        These conditions may evolve as the platform grows. Meaningful changes
        will be announced on the site. Continuing to use AUI Carpool after a
        change means you accept the new version.
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">
        General conditions of use
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
          <h2 className="font-display text-lg font-semibold text-ink">8. Contact</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Questions, reports or account requests:{" "}
            <a href="mailto:carpool.aui@gmail.com" className="font-medium text-pine-800 underline">
              carpool.aui@gmail.com
            </a>
            . For how we handle personal data, see the{" "}
            <Link href="/privacy" className="font-medium text-pine-800 underline">
              data protection policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
