"use client";

import { useActionState } from "react";
import { requestOtp, verifyOtp, type AuthState } from "@/app/actions";
import { Button, FormError, Input, Label, Notice, FieldHint } from "@/components/ui";

const initial: AuthState = { step: "email" };

export function LoginForm() {
  const [requestState, requestAction, requesting] = useActionState(
    requestOtp,
    initial,
  );
  const [verifyState, verifyAction, verifying] = useActionState(
    verifyOtp,
    initial,
  );

  if (requestState.step === "code" && requestState.email) {
    return (
      <form action={verifyAction} className="space-y-4">
        <Notice>{requestState.notice}</Notice>
        <FormError>{verifyState.error}</FormError>
        <input type="hidden" name="email" value={requestState.email} />
        <div>
          <Label htmlFor="code">6-digit code</Label>
          <Input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="••••••"
            maxLength={6}
            required
            autoFocus
            className="text-center font-display text-2xl tracking-[0.5em]"
          />
          <FieldHint>Sent to {requestState.email}</FieldHint>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={verifying}>
          {verifying ? "Checking…" : "Sign in"}
        </Button>
        <p className="text-center text-sm text-ink-faint">
          Wrong address?{" "}
          {/* full reload resets both action states */}
          <a href="/login" className="font-medium text-pine-800 hover:underline">
            Use a different email
          </a>
        </p>
      </form>
    );
  }

  return (
    <form action={requestAction} className="space-y-4">
      <FormError>{requestState.error}</FormError>
      <div>
        <Label htmlFor="email">Your AUI email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="f.lastname@aui.ma"
          autoComplete="email"
          required
          autoFocus
        />
        <FieldHint>
          We send a one-time code. No passwords to remember, and no way in
          without a real @aui.ma inbox.
        </FieldHint>
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={requesting}>
        {requesting ? "Sending code…" : "Continue"}
      </Button>
    </form>
  );
}
