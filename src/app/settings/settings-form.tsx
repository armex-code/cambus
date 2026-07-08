"use client";

import { useActionState } from "react";
import { updateProfileAction, type FormState } from "@/app/actions";
import {
  Button,
  FieldHint,
  FormError,
  Input,
  Label,
  Notice,
  Textarea,
} from "@/components/ui";

export function SettingsForm({
  defaultName,
  defaultPhone,
  defaultBio,
}: {
  defaultName: string;
  defaultPhone: string;
  defaultBio: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    updateProfileAction,
    {},
  );

  return (
    <form action={action} className="space-y-5">
      <FormError>{state.error}</FormError>
      {state.success && <Notice>Saved.</Notice>}
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" defaultValue={defaultName} required />
      </div>
      <div>
        <Label htmlFor="phone">Moroccan mobile</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={defaultPhone}
          required
        />
        <FieldHint>
          Only shared once a booking is confirmed, never shown on your
          public profile.
        </FieldHint>
      </div>
      <div>
        <Label htmlFor="bio">
          About you <span className="font-normal text-ink-faint">(optional)</span>
        </Label>
        <Textarea id="bio" name="bio" defaultValue={defaultBio} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
