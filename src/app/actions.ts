"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient, supabaseEnabled } from "@/lib/supabase/server";
import { getStore, isDemoMode } from "@/lib/data";
import { findOrCreateDemoProfile } from "@/lib/data/demo";
import {
  DEMO_OTP_CODE,
  DEMO_PENDING_COOKIE,
  DEMO_SESSION_COOKIE,
  encodeDemoSession,
  getCurrentProfile,
  getSessionUserId,
  profileComplete,
} from "@/lib/auth";
import { isAuiEmail } from "@/lib/utils";
import { CITIES } from "@/lib/cities";
import type { TimeOfDay, Weekday } from "@/lib/types";

export interface AuthState {
  step: "email" | "code";
  email?: string;
  error?: string;
  notice?: string;
}

export interface FormState {
  error?: string;
  success?: boolean;
}

const SESSION_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
} as const;

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export async function requestOtp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = str(formData, "email").toLowerCase();
  if (!isAuiEmail(email)) {
    return {
      step: "email",
      error:
        "Sign-in is reserved for @aui.ma addresses. That is what keeps every account a real member of the AUI community.",
    };
  }

  if (supabaseEnabled()) {
    const sb = await createClient();
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) return { step: "email", error: error.message };
    return {
      step: "code",
      email,
      notice: `We sent a 6-digit code to ${email}. It expires in an hour.`,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(DEMO_PENDING_COOKIE, email, SESSION_COOKIE_OPTS);
  return {
    step: "code",
    email,
    notice: `Demo mode: no email is actually sent. Use code ${DEMO_OTP_CODE} to sign in.`,
  };
}

export async function verifyOtp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = str(formData, "email").toLowerCase();
  const code = str(formData, "code").replace(/\s+/g, "");
  if (!isAuiEmail(email)) return { step: "email", error: "Start over with your @aui.ma email." };

  if (supabaseEnabled()) {
    const sb = await createClient();
    const { error } = await sb.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    if (error)
      return { step: "code", email, error: "That code didn't match. Check the email and try again." };
  } else {
    const cookieStore = await cookies();
    const pending = cookieStore.get(DEMO_PENDING_COOKIE)?.value;
    if (pending !== email)
      return { step: "email", error: "Session expired. Enter your email again." };
    if (code !== DEMO_OTP_CODE)
      return { step: "code", email, error: `In demo mode the code is ${DEMO_OTP_CODE}.` };
    const profile = findOrCreateDemoProfile(email);
    cookieStore.delete(DEMO_PENDING_COOKIE);
    cookieStore.set(
      DEMO_SESSION_COOKIE,
      encodeDemoSession(profile),
      SESSION_COOKIE_OPTS,
    );
  }

  const profile = await getCurrentProfile();
  redirect(profileComplete(profile) ? "/rides" : "/onboarding");
}

export async function signOut() {
  if (supabaseEnabled()) {
    const sb = await createClient();
    await sb.auth.signOut();
  } else {
    const cookieStore = await cookies();
    cookieStore.delete(DEMO_SESSION_COOKIE);
  }
  redirect("/");
}

export async function completeOnboarding(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  const fullName = str(formData, "fullName");
  const phone = str(formData, "phone");
  const bio = str(formData, "bio");
  if (fullName.length < 3) return { error: "Please enter your full name." };
  if (!/^(\+212|0)[5-8]\d{8}$/.test(phone.replace(/[\s-]/g, "")))
    return { error: "Enter a valid Moroccan mobile number (e.g. 06 12 34 56 78). It is only shared after a booking is confirmed." };
  await getStore().updateProfile(userId, { fullName, phone, bio });
  await refreshDemoSessionCookie(userId);
  redirect("/rides");
}

/** Demo mode: keep the profile-carrying session cookie in sync after edits. */
async function refreshDemoSessionCookie(userId: string) {
  if (!isDemoMode()) return;
  const profile = await getStore().getProfile(userId);
  if (!profile) return;
  const cookieStore = await cookies();
  cookieStore.set(
    DEMO_SESSION_COOKIE,
    encodeDemoSession(profile),
    SESSION_COOKIE_OPTS,
  );
}

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  const fullName = str(formData, "fullName");
  const phone = str(formData, "phone");
  const bio = str(formData, "bio");
  if (fullName.length < 3) return { error: "Please enter your full name." };
  if (!/^(\+212|0)[5-8]\d{8}$/.test(phone.replace(/[\s-]/g, "")))
    return { error: "Enter a valid Moroccan mobile number." };
  await getStore().updateProfile(userId, { fullName, phone, bio });
  await refreshDemoSessionCookie(userId);
  revalidatePath("/settings");
  return { success: true };
}

/* ------------------------------------------------------------------ */
/* Rides                                                               */
/* ------------------------------------------------------------------ */

const WEEKDAY_VALUES: Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export async function createRideAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const fromCity = str(formData, "fromCity");
  const toCity = str(formData, "toCity");
  const date = str(formData, "date");
  const time = str(formData, "time");
  const seats = Number(str(formData, "seats"));
  const price = Number(str(formData, "price"));
  const isRecurring = formData.get("isRecurring") === "on";
  const recurrenceDays = WEEKDAY_VALUES.filter(
    (d) => formData.get(`day-${d}`) === "on",
  );

  if (!CITIES.includes(fromCity as (typeof CITIES)[number]))
    return { error: "Pick a departure city." };
  if (!CITIES.includes(toCity as (typeof CITIES)[number]))
    return { error: "Pick a destination city." };
  if (fromCity === toCity)
    return { error: "Departure and destination can't be the same place." };
  if (fromCity !== "Ifrane" && toCity !== "Ifrane")
    return { error: "Rides on AUI Carpool start or end in Ifrane. Set one side of the trip to Ifrane." };
  if (!date || !time) return { error: "Set the departure date and time." };
  const departureAt = new Date(`${date}T${time}`);
  if (Number.isNaN(departureAt.getTime()) || departureAt.getTime() < Date.now())
    return { error: "Departure must be in the future." };
  if (!Number.isInteger(seats) || seats < 1 || seats > 4)
    return { error: "Offer between 1 and 4 seats." };
  if (!Number.isFinite(price) || price < 0 || price > 1000)
    return { error: "Set a fair price between 0 and 1000 MAD." };
  if (isRecurring && recurrenceDays.length === 0)
    return { error: "Pick at least one weekday for a recurring ride." };

  const result = await getStore().createRide(userId, {
    fromCity,
    fromDetail: str(formData, "fromDetail") || null,
    toCity,
    toDetail: str(formData, "toDetail") || null,
    departureAt: departureAt.toISOString(),
    seatsTotal: seats,
    pricePerSeat: Math.round(price),
    carModel: str(formData, "carModel") || null,
    carColor: str(formData, "carColor") || null,
    notes: str(formData, "notes") || null,
    isRecurring,
    recurrenceDays: isRecurring ? recurrenceDays : [],
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/rides");
  redirect(`/rides/${result.value}?published=1`);
}

export async function bookRideAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) redirect(`/login?next=/rides/${str(formData, "rideId")}`);
  const rideId = str(formData, "rideId");
  const seats = Number(str(formData, "seats") || "1");
  const result = await getStore().createBooking(rideId, userId, seats);
  if (!result.ok) return { error: result.error };
  revalidatePath(`/rides/${rideId}`);
  revalidatePath("/trips");
  return { success: true };
}

export async function respondBookingAction(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  const bookingId = str(formData, "bookingId");
  const decision = str(formData, "decision");
  if (decision !== "accepted" && decision !== "declined") return;
  await getStore().setBookingStatus(bookingId, decision, userId);
  revalidatePath("/trips");
}

export async function cancelBookingAction(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  await getStore().setBookingStatus(str(formData, "bookingId"), "cancelled", userId);
  revalidatePath("/trips");
}

export async function cancelRideAction(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  await getStore().cancelRide(str(formData, "rideId"), userId);
  revalidatePath("/trips");
  revalidatePath("/rides");
}

/* ------------------------------------------------------------------ */
/* Ride requests                                                       */
/* ------------------------------------------------------------------ */

const TIMES_OF_DAY: TimeOfDay[] = ["morning", "afternoon", "evening", "flexible"];

export async function createRequestAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?next=/requests/new");

  const fromCity = str(formData, "fromCity");
  const toCity = str(formData, "toCity");
  const travelDate = str(formData, "date");
  const timeOfDay = str(formData, "timeOfDay") as TimeOfDay;
  const seats = Number(str(formData, "seats") || "1");

  if (!CITIES.includes(fromCity as (typeof CITIES)[number]))
    return { error: "Pick a departure city." };
  if (!CITIES.includes(toCity as (typeof CITIES)[number]))
    return { error: "Pick a destination city." };
  if (fromCity === toCity)
    return { error: "Departure and destination can't be the same place." };
  if (fromCity !== "Ifrane" && toCity !== "Ifrane")
    return { error: "Requests on AUI Carpool start or end in Ifrane. Set one side of the trip to Ifrane." };
  if (!travelDate || travelDate < new Date().toISOString().slice(0, 10))
    return { error: "Pick a date from today onward." };
  if (!TIMES_OF_DAY.includes(timeOfDay))
    return { error: "Pick a time of day." };
  if (!Number.isInteger(seats) || seats < 1 || seats > 4)
    return { error: "Request between 1 and 4 seats." };

  const result = await getStore().createRequest(userId, {
    fromCity,
    toCity,
    travelDate,
    timeOfDay,
    seats,
    notes: str(formData, "notes") || null,
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/requests");
  redirect("/requests?posted=1");
}

export async function closeRequestAction(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  await getStore().closeRequest(str(formData, "requestId"), userId);
  revalidatePath("/requests");
}

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

export async function submitReviewAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");
  const bookingId = str(formData, "bookingId");
  const rating = Number(str(formData, "rating"));
  const comment = str(formData, "comment") || null;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return { error: "Pick a star rating first." };
  const result = await getStore().createReview(userId, bookingId, rating, comment);
  if (!result.ok) return { error: result.error };
  revalidatePath("/trips");
  redirect("/trips?reviewed=1");
}
