"use client";

import { useActionState, useState } from "react";
import { createRideAction, type FormState } from "@/app/actions";
import { CITIES, priceHint, roadKm, suggestedPrice } from "@/lib/cities";
import { WEEKDAYS } from "@/lib/utils";
import {
  Button,
  FieldHint,
  FormError,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui";

export function OfferForm({
  initialFrom,
  initialTo,
}: {
  initialFrom?: string;
  initialTo?: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    createRideAction,
    {},
  );
  const validCity = (c?: string) => (c && (CITIES as readonly string[]).includes(c) ? c : "");
  const [fromCity, setFromCity] = useState(validCity(initialFrom) || "Ifrane");
  const [toCity, setToCity] = useState(validCity(initialTo));
  const [recurring, setRecurring] = useState(false);
  const [price, setPrice] = useState("");
  const hint = toCity ? priceHint(fromCity, toCity) : null;
  const suggested = toCity ? suggestedPrice(fromCity, toCity) : null;
  const km = toCity ? roadKm(fromCity, toCity) : null;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-6">
      <FormError>{state.error}</FormError>

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-semibold text-ink">
          Route
        </legend>
        <p className="text-xs text-ink-faint">
          Every ride on AUI Carpool starts or ends in Ifrane.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="fromCity">From</Label>
            <Select
              id="fromCity"
              name="fromCity"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              required
            >
              {CITIES.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="toCity">To</Label>
            <Select
              id="toCity"
              name="toCity"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              required
            >
              <option value="" disabled>
                Pick a destination
              </option>
              {CITIES.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="fromDetail">
              Pickup point <span className="font-normal text-ink-faint">(optional)</span>
            </Label>
            <Input
              id="fromDetail"
              name="fromDetail"
              placeholder="e.g. AUI main gate"
            />
          </div>
          <div>
            <Label htmlFor="toDetail">
              Drop-off area <span className="font-normal text-ink-faint">(optional)</span>
            </Label>
            <Input id="toDetail" name="toDetail" placeholder="e.g. Maârif" />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-semibold text-ink">
          When
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="date">Departure date</Label>
            <Input id="date" type="date" name="date" min={today} required />
          </div>
          <div>
            <Label htmlFor="time">Departure time</Label>
            <Input id="time" type="time" name="time" required />
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-paper-dim/60 px-4 py-3">
          <input
            type="checkbox"
            name="isRecurring"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
            className="h-4 w-4 accent-pine-700"
          />
          <span className="text-sm">
            <span className="font-medium text-ink">This is a weekly ride</span>
            <span className="block text-xs text-ink-faint">
              e.g. you drive home every Friday and come back Sunday
            </span>
          </span>
        </label>
        {recurring && (
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => (
              <label
                key={day.value}
                className="cursor-pointer rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-sm font-medium text-ink-soft transition-colors has-[:checked]:border-pine-700 has-[:checked]:bg-pine-700 has-[:checked]:text-paper"
              >
                <input
                  type="checkbox"
                  name={`day-${day.value}`}
                  className="sr-only"
                />
                {day.short}
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-semibold text-ink">
          Seats & price
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="seats">Free seats</Label>
            <Select id="seats" name="seats" defaultValue="3">
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Price per seat (MAD)</Label>
            <Input
              id="price"
              type="number"
              name="price"
              min={0}
              max={1000}
              step={5}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={suggested ? String(suggested) : "e.g. 40"}
              required
            />
            {suggested !== null && (
              <button
                type="button"
                onClick={() => setPrice(String(suggested))}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-pine-300 bg-pine-50 px-3 py-1.5 text-xs font-semibold text-pine-800 transition-colors hover:bg-pine-100"
              >
                Recommended: {suggested} MAD
                {km ? <span className="font-normal text-pine-600">· ~{km} km</span> : null}
              </button>
            )}
            <FieldHint>
              {hint
                ? `Riders usually pay ${hint.low} to ${hint.high} MAD on this route. Fair prices fill seats, and you always set the final price.`
                : "Based on distance, enough to cover fuel and tolls. You set the final price."}
            </FieldHint>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-semibold text-ink">
          Car & notes
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="carModel">
              Car <span className="font-normal text-ink-faint">(optional)</span>
            </Label>
            <Input id="carModel" name="carModel" placeholder="e.g. Dacia Duster" />
          </div>
          <div>
            <Label htmlFor="carColor">
              Color <span className="font-normal text-ink-faint">(optional)</span>
            </Label>
            <Input id="carColor" name="carColor" placeholder="e.g. Grey" />
          </div>
        </div>
        <div>
          <Label htmlFor="notes">
            Anything passengers should know{" "}
            <span className="font-normal text-ink-faint">(optional)</span>
          </Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Luggage space, music, stops on the way, how long you'll wait…"
          />
        </div>
      </fieldset>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Publishing…" : "Publish ride"}
      </Button>
    </form>
  );
}
