import { cookies } from "next/headers";
import { createClient, supabaseEnabled } from "@/lib/supabase/server";
import { getStore } from "@/lib/data";
import { ensureDemoProfile } from "@/lib/data/demo";
import type { Profile } from "@/lib/types";

export const DEMO_SESSION_COOKIE = "aui_demo_session";
export const DEMO_PENDING_COOKIE = "aui_demo_pending_email";
export const DEMO_OTP_CODE = "424242";

/**
 * Shared tour account. It also exists in Supabase (created by
 * supabase/seed.sql with this fixed password) so the demo keeps working
 * after switching from the in-memory store to the real database. Remove
 * the auth user to disable it for launch.
 */
export const DEMO_EMAIL = "demo@aui.ma";
export const DEMO_SUPABASE_PASSWORD = "aui-carpool-demo-424242";

/**
 * Demo sessions carry the whole profile in the cookie (base64url JSON) so
 * they survive serverless instances that each seed their own in-memory
 * store. Supabase mode uses real auth cookies instead.
 */
export function encodeDemoSession(profile: Profile) {
  return Buffer.from(JSON.stringify(profile), "utf8").toString("base64url");
}

async function readDemoSession(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (parsed && typeof parsed.id === "string" && typeof parsed.email === "string") {
      return parsed as Profile;
    }
  } catch {
    // Malformed/legacy cookie: treat as signed out.
  }
  return null;
}

export async function getSessionUserId(): Promise<string | null> {
  if (supabaseEnabled()) {
    const sb = await createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    return user?.id ?? null;
  }
  const session = await readDemoSession();
  if (!session) return null;
  ensureDemoProfile(session);
  return session.id;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const id = await getSessionUserId();
  if (!id) return null;
  return getStore().getProfile(id);
}

/** Profile is complete once we have a real name and a phone for WhatsApp. */
export function profileComplete(profile: Profile | null) {
  return Boolean(profile && profile.fullName.trim() && profile.phone?.trim());
}
