import type { Metadata } from "next";
import {
  AlertTriangle,
  BadgeCheck,
  Banknote,
  Clock3,
  MessageCircle,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { ButtonLink, Card } from "@/components/ui";
import { ZelligePattern } from "@/components/pattern";

export const metadata: Metadata = { title: "Safety & community rules" };

const PILLARS = [
  {
    icon: BadgeCheck,
    title: "Verified AUI emails only",
    body: "Accounts need a live @aui.ma inbox. Students, staff and faculty, nobody else. If someone is on here, they belong to the same campus you do.",
  },
  {
    icon: Star,
    title: "Ratings go both ways",
    body: "After each trip, passengers rate drivers and drivers rate passengers. Check a profile before booking or accepting; the community's memory is the strongest safety feature we have.",
  },
  {
    icon: MessageCircle,
    title: "Private until confirmed",
    body: "Phone numbers are exchanged only after a driver accepts a request, and only between the two of you. Nothing is posted publicly, ever.",
  },
  {
    icon: Banknote,
    title: "Cash keeps it simple",
    body: "The price is on the listing before you book. Pay the driver in the car. No cards on file, no payment disputes, no surprise fees.",
  },
];

const RULES = [
  { icon: Clock3, text: "Be on time. A carpool works on trust, so if you'll be late, say it on WhatsApp early." },
  { icon: Users, text: "Drivers: your car, your rules, but announce them on the listing (luggage, stops, music)." },
  { icon: Banknote, text: "Charge to share costs, not to profit. Fair prices are why this beats a grand taxi." },
  { icon: AlertTriangle, text: "Cancel as early as possible, from the app, so the other side can re-plan. No silent no-shows." },
  { icon: ShieldCheck, text: "Seatbelts on, reasonable speed, no phone while driving. Passengers, speak up. It's your ride too." },
  { icon: Star, text: "Rate honestly after every trip. Inflated stars help nobody; honest ones protect everyone." },
];

export default function SafetyPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-pine-900">
        <ZelligePattern className="text-pine-700/30" id="safety-page-zellige" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <ShieldCheck size={40} className="mx-auto text-saffron-300" />
          <h1 className="mt-4 font-display text-3xl font-semibold text-paper sm:text-4xl">
            Safety & community rules
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-pine-200 sm:text-base">
            AUI Carpool works because everyone in the car answers to the same
            campus. Here's how we keep it that way.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="p-6">
              <Icon size={22} className="text-pine-700" />
              <h2 className="mt-3 font-display text-lg font-semibold text-ink">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
            </Card>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-semibold text-ink">
          The rules of the road
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Six things everyone agrees to by using the platform.
        </p>
        <ul className="mt-6 space-y-3">
          {RULES.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-start gap-3 rounded-xl border border-line bg-white p-4 text-sm leading-relaxed text-ink-soft shadow-card"
            >
              <Icon size={18} className="mt-0.5 shrink-0 text-pine-700" />
              {text}
            </li>
          ))}
        </ul>

        <Card className="mt-14 p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-ink">
            Something went wrong on a ride?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            First, leave an honest review. That's the record the next member
            relies on. If it's more serious than a review can carry (dangerous
            driving, harassment, a no-show that left you stranded), email{" "}
            <a
              href="mailto:carpool.aui@gmail.com?subject=AUI%20Carpool%20report"
              className="font-medium text-pine-800 underline"
            >
              carpool.aui@gmail.com
            </a>{" "}
            with the ride details. Repeated or serious reports get an account
            removed. In an emergency, always call 19 (police) or 15
            (ambulance) first.
          </p>
        </Card>

        <div className="mt-10 text-center">
          <ButtonLink href="/rides" size="lg">
            Back to rides
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
