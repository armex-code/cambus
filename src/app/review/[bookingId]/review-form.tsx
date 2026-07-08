"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { submitReviewAction, type FormState } from "@/app/actions";
import { Button, FormError, Label, Textarea } from "@/components/ui";

export function ReviewForm({ bookingId }: { bookingId: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    submitReviewAction,
    {},
  );
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const labels = ["", "Bad", "Meh", "Okay", "Good", "Excellent"];

  return (
    <form action={action} className="space-y-5">
      <FormError>{state.error}</FormError>
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="rating" value={rating} />
      <div>
        <Label>Your rating</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              className="rounded p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-pine-600"
            >
              <Star
                size={30}
                className={
                  value <= (hover || rating)
                    ? "fill-saffron-400 text-saffron-400"
                    : "fill-line text-line"
                }
              />
            </button>
          ))}
          <span className="ml-2 min-w-20 text-sm font-medium text-ink-soft">
            {labels[hover || rating]}
          </span>
        </div>
      </div>
      <div>
        <Label htmlFor="comment">
          A few words <span className="font-normal text-ink-faint">(optional)</span>
        </Label>
        <Textarea
          id="comment"
          name="comment"
          maxLength={400}
          placeholder="Punctuality, driving, vibe. What should the next rider know?"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={pending || rating === 0}
      >
        {pending ? "Posting…" : "Post review"}
      </Button>
    </form>
  );
}
