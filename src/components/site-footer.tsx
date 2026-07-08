import Link from "next/link";
import { Logo } from "./logo";
import { ZelligePattern } from "./pattern";

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-pine-950 pb-24 text-pine-200 md:pb-0">
      <ZelligePattern className="text-pine-800/40" id="footer-zellige" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div className="max-w-xs">
            <Logo dark />
            <p className="mt-3 text-sm leading-relaxed text-pine-300">
              Rides between Ifrane and the rest of Morocco, shared by the AUI
              community: students, staff and faculty.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm">
            <div className="space-y-2.5">
              <p className="font-semibold text-paper">Ride</p>
              <Link href="/rides" className="block hover:text-paper">Find a ride</Link>
              <Link href="/offer" className="block hover:text-paper">Offer a ride</Link>
              <Link href="/requests" className="block hover:text-paper">Ride requests</Link>
            </div>
            <div className="space-y-2.5">
              <p className="font-semibold text-paper">Trust</p>
              <Link href="/safety" className="block hover:text-paper">Safety and rules</Link>
              <Link href="/terms" className="block hover:text-paper">General conditions</Link>
              <Link href="/privacy" className="block hover:text-paper">Data protection</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-pine-800 pt-6 text-xs text-pine-400">
          <p>
            AUI Carpool is an independent student initiative and is not
            operated by Al Akhawayn University. Payments happen in cash,
            between members. The platform never touches money.
          </p>
        </div>
      </div>
    </footer>
  );
}
