"use client";

import { useActionState } from "react";
import { bookRideAction, type FormState } from "@/app/actions";
import { Button, FormError, Label, Select } from "@/components/ui";

export function BookingForm({
  rideId,
  maxSeats,
}: {
  rideId: string;
  maxSeats: number;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    bookRideAction,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      <FormError>{state.error}</FormError>
      <input type="hidden" name="rideId" value={rideId} />
      <div>
        <Label htmlFor="seats">Seats</Label>
        <Select id="seats" name="seats" defaultValue="1">
          {Array.from({ length: maxSeats }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "seat" : "seats"}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending request…" : "Request a seat"}
      </Button>
      <p className="text-center text-xs leading-relaxed text-ink-faint">
        No payment now, you'll pay the driver in cash. They'll accept or
        decline your request, and you'll see it in My Trips.
      </p>
    </form>
  );
}
