import type {
  Booking,
  BookingStatus,
  BookingWithPassenger,
  BookingWithRide,
  NewRequestInput,
  NewRideInput,
  Profile,
  PublicProfile,
  ReviewWithReviewer,
  Ride,
  RideFilters,
  RideRequestWithRider,
  RideWithDriver,
} from "@/lib/types";
import type { DataStore, Result } from "./store";
import { buildSeed, type DemoDb } from "./demo-seed";

/**
 * In-memory store used when Supabase env vars are absent. State is
 * per-server-instance and resets on redeploy — good enough to tour the
 * product; the Supabase store is the durable one.
 */

const globalRef = globalThis as unknown as { __auiDemoDb?: DemoDb };

function db(): DemoDb {
  if (!globalRef.__auiDemoDb) globalRef.__auiDemoDb = buildSeed();
  return globalRef.__auiDemoDb;
}

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${(db().counter++).toString(36)}`;
}

function acceptedSeats(rideId: string) {
  return db()
    .bookings.filter((b) => b.rideId === rideId && b.status === "accepted")
    .reduce((sum, b) => sum + b.seats, 0);
}

function toPublic(profile: Profile): PublicProfile {
  const reviews = db().reviews.filter((r) => r.revieweeId === profile.id);
  const driver = reviews.filter((r) => r.reviewedAs === "driver");
  const passenger = reviews.filter((r) => r.reviewedAs === "passenger");
  const avg = (list: { rating: number }[]) =>
    list.length === 0
      ? null
      : Math.round(
          (list.reduce((s, r) => s + r.rating, 0) / list.length) * 10,
        ) / 10;
  return {
    id: profile.id,
    fullName: profile.fullName,
    bio: profile.bio,
    createdAt: profile.createdAt,
    verified: true,
    driverAvg: avg(driver),
    driverCount: driver.length,
    passengerAvg: avg(passenger),
    passengerCount: passenger.length,
  };
}

function withDriver(ride: Ride): RideWithDriver | null {
  const driver = db().profiles.find((p) => p.id === ride.driverId);
  if (!driver) return null;
  return {
    ...ride,
    driver: toPublic(driver),
    seatsLeft: Math.max(0, ride.seatsTotal - acceptedSeats(ride.id)),
  };
}

/**
 * On serverless hosts each instance has its own in-memory store, so a
 * profile created at login on one instance may be missing on the next.
 * The session cookie carries the profile; this re-inserts it when absent.
 */
export function ensureDemoProfile(profile: Profile): Profile {
  const existing = db().profiles.find((p) => p.id === profile.id);
  if (existing) return existing;
  const copy = { ...profile };
  db().profiles.push(copy);
  return copy;
}

export function findOrCreateDemoProfile(email: string): Profile {
  const normalized = email.trim().toLowerCase();
  const existing = db().profiles.find((p) => p.email === normalized);
  if (existing) return existing;
  const local = normalized.split("@")[0];
  const guessedName = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(" ");
  const profile: Profile = {
    id: newId("u"),
    email: normalized,
    fullName: guessedName,
    phone: null,
    bio: null,
    createdAt: new Date().toISOString(),
  };
  db().profiles.push(profile);
  return profile;
}

export class DemoStore implements DataStore {
  async getProfile(id: string) {
    return db().profiles.find((p) => p.id === id) ?? null;
  }

  async getPublicProfile(id: string) {
    const profile = db().profiles.find((p) => p.id === id);
    return profile ? toPublic(profile) : null;
  }

  async updateProfile(
    id: string,
    patch: { fullName?: string; phone?: string; bio?: string },
  ) {
    const profile = db().profiles.find((p) => p.id === id);
    if (!profile) return;
    if (patch.fullName !== undefined) profile.fullName = patch.fullName;
    if (patch.phone !== undefined) profile.phone = patch.phone;
    if (patch.bio !== undefined) profile.bio = patch.bio;
  }

  async listRides(filters: RideFilters) {
    const cutoff = Date.now() - 60 * 60 * 1000;
    return db()
      .rides.filter((ride) => {
        if (ride.status !== "active") return false;
        if (new Date(ride.departureAt).getTime() < cutoff) return false;
        if (filters.from && ride.fromCity !== filters.from) return false;
        if (filters.to && ride.toCity !== filters.to) return false;
        if (filters.date && ride.departureAt.slice(0, 10) !== filters.date)
          return false;
        return true;
      })
      .map(withDriver)
      .filter((r): r is RideWithDriver => r !== null)
      .sort(
        (a, b) =>
          new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime(),
      );
  }

  async getRide(id: string) {
    const ride = db().rides.find((r) => r.id === id);
    return ride ? withDriver(ride) : null;
  }

  async createRide(driverId: string, input: NewRideInput): Promise<Result<string>> {
    const driver = db().profiles.find((p) => p.id === driverId);
    if (!driver) return { ok: false, error: "Not signed in." };
    const ride: Ride = {
      id: newId("r"),
      driverId,
      ...input,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    db().rides.push(ride);
    return { ok: true, value: ride.id };
  }

  async cancelRide(rideId: string, driverId: string): Promise<Result> {
    const ride = db().rides.find((r) => r.id === rideId);
    if (!ride || ride.driverId !== driverId)
      return { ok: false, error: "Ride not found." };
    ride.status = "cancelled";
    for (const booking of db().bookings) {
      if (
        booking.rideId === rideId &&
        (booking.status === "pending" || booking.status === "accepted")
      ) {
        booking.status = "cancelled";
      }
    }
    return { ok: true, value: undefined };
  }

  async listRidesByDriver(driverId: string) {
    return db()
      .rides.filter((r) => r.driverId === driverId)
      .map(withDriver)
      .filter((r): r is RideWithDriver => r !== null)
      .sort(
        (a, b) =>
          new Date(b.departureAt).getTime() - new Date(a.departureAt).getTime(),
      );
  }

  async getBooking(id: string) {
    return db().bookings.find((b) => b.id === id) ?? null;
  }

  async createBooking(
    rideId: string,
    passengerId: string,
    seats: number,
  ): Promise<Result<string>> {
    const ride = db().rides.find((r) => r.id === rideId);
    if (!ride || ride.status !== "active")
      return { ok: false, error: "This ride is no longer available." };
    if (ride.driverId === passengerId)
      return { ok: false, error: "You can't book a seat on your own ride." };
    if (new Date(ride.departureAt).getTime() < Date.now())
      return { ok: false, error: "This ride has already departed." };
    const existing = db().bookings.find(
      (b) =>
        b.rideId === rideId &&
        b.passengerId === passengerId &&
        (b.status === "pending" || b.status === "accepted"),
    );
    if (existing)
      return { ok: false, error: "You already requested a seat on this ride." };
    const left = ride.seatsTotal - acceptedSeats(rideId);
    if (seats < 1 || seats > left)
      return { ok: false, error: `Only ${left} seat(s) left on this ride.` };
    const booking: Booking = {
      id: newId("b"),
      rideId,
      passengerId,
      seats,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    db().bookings.push(booking);
    return { ok: true, value: booking.id };
  }

  async setBookingStatus(
    bookingId: string,
    status: BookingStatus,
    actorId: string,
  ): Promise<Result> {
    const booking = db().bookings.find((b) => b.id === bookingId);
    if (!booking) return { ok: false, error: "Booking not found." };
    const ride = db().rides.find((r) => r.id === booking.rideId);
    if (!ride) return { ok: false, error: "Ride not found." };

    const isDriver = ride.driverId === actorId;
    const isPassenger = booking.passengerId === actorId;

    if (status === "cancelled" && !isPassenger)
      return { ok: false, error: "Only the passenger can cancel a booking." };
    if ((status === "accepted" || status === "declined") && !isDriver)
      return { ok: false, error: "Only the driver can respond to requests." };

    if (status === "accepted") {
      const left = ride.seatsTotal - acceptedSeats(ride.id);
      if (booking.seats > left)
        return { ok: false, error: "Not enough seats left to accept this." };
    }

    booking.status = status;
    return { ok: true, value: undefined };
  }

  async listBookingsByPassenger(passengerId: string) {
    return db()
      .bookings.filter((b) => b.passengerId === passengerId)
      .map((b) => {
        const ride = db().rides.find((r) => r.id === b.rideId);
        const full = ride ? withDriver(ride) : null;
        return full ? ({ ...b, ride: full } satisfies BookingWithRide) : null;
      })
      .filter((b): b is BookingWithRide => b !== null)
      .sort(
        (a, b) =>
          new Date(b.ride.departureAt).getTime() -
          new Date(a.ride.departureAt).getTime(),
      );
  }

  async listBookingsForRide(rideId: string) {
    return db()
      .bookings.filter((b) => b.rideId === rideId)
      .map((b) => {
        const passenger = db().profiles.find((p) => p.id === b.passengerId);
        return passenger
          ? ({ ...b, passenger: toPublic(passenger) } satisfies BookingWithPassenger)
          : null;
      })
      .filter((b): b is BookingWithPassenger => b !== null)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }

  async getBookingForPassenger(rideId: string, passengerId: string) {
    return (
      db().bookings.find(
        (b) =>
          b.rideId === rideId &&
          b.passengerId === passengerId &&
          b.status !== "cancelled" &&
          b.status !== "declined",
      ) ?? null
    );
  }

  async getContactPhone(bookingId: string, requesterId: string) {
    const booking = db().bookings.find((b) => b.id === bookingId);
    if (!booking || booking.status !== "accepted") return null;
    const ride = db().rides.find((r) => r.id === booking.rideId);
    if (!ride) return null;
    let other: string | null = null;
    if (requesterId === booking.passengerId) other = ride.driverId;
    else if (requesterId === ride.driverId) other = booking.passengerId;
    if (!other) return null;
    const profile = db().profiles.find((p) => p.id === other);
    if (!profile?.phone) return null;
    return { phone: profile.phone, name: profile.fullName };
  }

  async listRequests() {
    const today = new Date().toISOString().slice(0, 10);
    return db()
      .requests.filter((q) => q.status === "open" && q.travelDate >= today)
      .map((q) => {
        const rider = db().profiles.find((p) => p.id === q.riderId);
        return rider
          ? ({ ...q, rider: toPublic(rider) } satisfies RideRequestWithRider)
          : null;
      })
      .filter((q): q is RideRequestWithRider => q !== null)
      .sort((a, b) => a.travelDate.localeCompare(b.travelDate));
  }

  async createRequest(
    riderId: string,
    input: NewRequestInput,
  ): Promise<Result<string>> {
    const rider = db().profiles.find((p) => p.id === riderId);
    if (!rider) return { ok: false, error: "Not signed in." };
    const request = {
      id: newId("q"),
      riderId,
      ...input,
      status: "open" as const,
      createdAt: new Date().toISOString(),
    };
    db().requests.push(request);
    return { ok: true, value: request.id };
  }

  async closeRequest(requestId: string, riderId: string): Promise<Result> {
    const request = db().requests.find((q) => q.id === requestId);
    if (!request || request.riderId !== riderId)
      return { ok: false, error: "Request not found." };
    request.status = "closed";
    return { ok: true, value: undefined };
  }

  async listReviewsFor(userId: string) {
    return db()
      .reviews.filter((r) => r.revieweeId === userId)
      .map((r) => {
        const reviewer = db().profiles.find((p) => p.id === r.reviewerId);
        return reviewer
          ? ({ ...r, reviewer: toPublic(reviewer) } satisfies ReviewWithReviewer)
          : null;
      })
      .filter((r): r is ReviewWithReviewer => r !== null)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  async createReview(
    reviewerId: string,
    bookingId: string,
    rating: number,
    comment: string | null,
  ): Promise<Result> {
    if (rating < 1 || rating > 5)
      return { ok: false, error: "Rating must be between 1 and 5." };
    const booking = db().bookings.find((b) => b.id === bookingId);
    if (!booking || booking.status !== "accepted")
      return { ok: false, error: "You can only review confirmed rides." };
    const ride = db().rides.find((r) => r.id === booking.rideId);
    if (!ride) return { ok: false, error: "Ride not found." };
    if (new Date(ride.departureAt).getTime() > Date.now())
      return { ok: false, error: "You can review once the ride has happened." };

    let revieweeId: string;
    let reviewedAs: "driver" | "passenger";
    if (reviewerId === booking.passengerId) {
      revieweeId = ride.driverId;
      reviewedAs = "driver";
    } else if (reviewerId === ride.driverId) {
      revieweeId = booking.passengerId;
      reviewedAs = "passenger";
    } else {
      return { ok: false, error: "You weren't part of this ride." };
    }

    const already = db().reviews.find(
      (r) => r.bookingId === bookingId && r.reviewerId === reviewerId,
    );
    if (already)
      return { ok: false, error: "You already reviewed this ride." };

    db().reviews.push({
      id: newId("v"),
      bookingId,
      reviewerId,
      revieweeId,
      reviewedAs,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    });
    return { ok: true, value: undefined };
  }

  async hasReviewed(bookingId: string, reviewerId: string) {
    return db().reviews.some(
      (r) => r.bookingId === bookingId && r.reviewerId === reviewerId,
    );
  }
}
