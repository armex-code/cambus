import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { isDemoMode } from "@/lib/data";
import { Card } from "@/components/ui";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const profile = await getCurrentProfile();
  if (profile) redirect("/rides");

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-pine-100 px-3.5 py-1.5 text-xs font-semibold text-pine-800">
          <ShieldCheck size={14} />
          AUI community only, verified by email
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
          Sign in to AUI Carpool
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          One code to your @aui.ma inbox and you're in.
        </p>
      </div>
      <Card className="p-6 sm:p-8">
        <LoginForm />
        <p className="mt-5 text-center text-xs text-ink-faint">
          By continuing you accept the{" "}
          <Link href="/terms" className="underline hover:text-pine-800">
            general conditions
          </Link>{" "}
          and the{" "}
          <Link href="/privacy" className="underline hover:text-pine-800">
            data protection policy
          </Link>
          .
        </p>
      </Card>
      {isDemoMode() && (
        <p className="mt-4 text-center text-xs text-ink-faint">
          This deployment runs in demo mode with sample data. Sign in with{" "}
          <span className="font-medium text-ink-soft">demo@aui.ma</span> (code
          424242) to tour a pre-filled account.
        </p>
      )}
    </div>
  );
}
