"use client";

import { useActionState } from "react";
import { createRequestAction, type FormState } from "@/app/actions";
import { CITIES } from "@/lib/cities";
import {
  Button,
  FieldHint,
  FormError,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui";

export function RequestForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    createRequestAction,
    {},
  );
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-5">
      <FormError>{state.error}</FormError>
      <p className="text-xs text-ink-faint">
        Every trip on AUI Carpool starts or ends in Ifrane.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="fromCity">From</Label>
          <Select id="fromCity" name="fromCity" defaultValue="Ifrane" required>
            {CITIES.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="toCity">To</Label>
          <Select id="toCity" name="toCity" defaultValue="" required>
            <option value="" disabled>
              Pick a destination
            </option>
            {CITIES.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="date">Travel date</Label>
          <Input id="date" type="date" name="date" min={today} required />
        </div>
        <div>
          <Label htmlFor="timeOfDay">Time of day</Label>
          <Select id="timeOfDay" name="timeOfDay" defaultValue="flexible">
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="flexible">I'm flexible</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="seats">Seats needed</Label>
          <Select id="seats" name="seats" defaultValue="1">
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="notes">
          Details <span className="font-normal text-ink-faint">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Luggage, exact area, how flexible you are on time…"
        />
        <FieldHint>
          Shown publicly with your name and rating, so don't put your
          phone number here.
        </FieldHint>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Posting…" : "Post request"}
      </Button>
    </form>
  );
}
