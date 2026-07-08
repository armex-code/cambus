import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile, profileComplete } from "@/lib/auth";
import { Card } from "@/components/ui";
import { OfferForm } from "./offer-form";

export const metadata: Metadata = { title: "Offer a ride" };

export default async function OfferPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!profileComplete(profile)) redirect("/onboarding");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Offer a ride
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Driving out of Ifrane, or back to campus? Fill your empty seats with
        people from AUI and cover your fuel.
      </p>
      <Card className="mt-6 p-6 sm:p-8">
        <OfferForm initialFrom={from} initialTo={to} />
      </Card>
    </div>
  );
}
