import type {
  Booking,
  Profile,
  Review,
  Ride,
  RideRequest,
  Weekday,
} from "@/lib/types";

export interface DemoDb {
  profiles: Profile[];
  rides: Ride[];
  bookings: Booking[];
  requests: RideRequest[];
  reviews: Review[];
  counter: number;
}

const WEEKDAY_INDEX: Record<Weekday, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

function at(daysFromNow: number, hour: number, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/** Next occurrence of a weekday, at least `minDays` days out. */
function nextWeekday(day: Weekday, hour: number, minute = 0, minDays = 1) {
  const d = new Date();
  let delta = (WEEKDAY_INDEX[day] - d.getDay() + 7) % 7;
  if (delta < minDays) delta += 7;
  return at(delta, hour, minute);
}

function daysAgo(days: number, hour: number) {
  return at(-days, hour);
}

function ymd(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

/**
 * Believable campus data: names, cars, routes and prices that ring true for
 * Ifrane. The demo account (demo@aui.ma) has activity in every state so the
 * whole product can be toured without a database.
 */
export function buildSeed(): DemoDb {
  const joined = (monthsAgo: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsAgo);
    return d.toISOString();
  };

  const profiles: Profile[] = [
    { id: "u-demo", email: "demo@aui.ma", fullName: "Demo Student", phone: "0612000000", bio: "Just here to look around.", createdAt: joined(2) },
    { id: "u-yassine", email: "y.benali@aui.ma", fullName: "Yassine Benali", phone: "0661234501", bio: "SBA senior. I drive home to Casa most weekends. Music requests welcome.", createdAt: joined(28) },
    { id: "u-salma", email: "s.elamrani@aui.ma", fullName: "Salma El Amrani", phone: "0661234502", bio: "CS junior. Fès every weekend, always on time.", createdAt: joined(19) },
    { id: "u-omar", email: "o.tazi@aui.ma", fullName: "Omar Tazi", phone: "0661234503", bio: "Engineering grad student. Rabat runs on Fridays.", createdAt: joined(35) },
    { id: "u-aya", email: "a.bennis@aui.ma", fullName: "Aya Bennis", phone: "0661234504", bio: "HRD sophomore, usually riding to Meknès.", createdAt: joined(9) },
    { id: "u-mehdi", email: "m.alaoui@aui.ma", fullName: "Mehdi Alaoui", phone: "0661234505", bio: "Marrakchi in exile. Long drives, good playlists.", createdAt: joined(23) },
    { id: "u-rim", email: "r.chraibi@aui.ma", fullName: "Rim Chraibi", phone: "0661234506", bio: null, createdAt: joined(6) },
    { id: "u-hamza", email: "h.elfassi@aui.ma", fullName: "Hamza El Fassi", phone: "0661234507", bio: "Fassi, drives back every Sunday evening.", createdAt: joined(15) },
    { id: "u-nour", email: "n.squalli@aui.ma", fullName: "Nour Squalli", phone: "0661234508", bio: "BA freshman. Looking for regular Rabat rides.", createdAt: joined(4) },
  ];

  const rides: Ride[] = [
    {
      id: "r-azrou-today", driverId: "u-salma",
      fromCity: "Ifrane", fromDetail: "AUI main gate", toCity: "Azrou", toDetail: "Grand taxi station",
      departureAt: at(0, 18, 30), seatsTotal: 3, pricePerSeat: 15,
      carModel: "Renault Clio 4", carColor: "White", notes: "Quick Azrou run after class. Leaving on the dot.",
      isRecurring: false, recurrenceDays: [], status: "active", createdAt: daysAgo(1, 10),
    },
    {
      id: "r-meknes-tmrw", driverId: "u-mehdi",
      fromCity: "Ifrane", fromDetail: "Marché parking", toCity: "Meknès", toDetail: "Hamria",
      departureAt: at(1, 14, 0), seatsTotal: 3, pricePerSeat: 40,
      carModel: "Fiat Tipo", carColor: "Silver", notes: "Can drop you anywhere central. One medium bag each please.",
      isRecurring: false, recurrenceDays: [], status: "active", createdAt: daysAgo(1, 9),
    },
    {
      id: "r-fes-fri", driverId: "u-salma",
      fromCity: "Ifrane", fromDetail: "AUI main gate", toCity: "Fès", toDetail: "Route d'Imouzzer / Atlas",
      departureAt: nextWeekday("fri", 17, 0), seatsTotal: 3, pricePerSeat: 40,
      carModel: "Renault Clio 4", carColor: "White", notes: "Weekly ride home. I leave right after Friday classes.",
      isRecurring: true, recurrenceDays: ["fri"], status: "active", createdAt: daysAgo(20, 12),
    },
    {
      id: "r-casa-fri", driverId: "u-yassine",
      fromCity: "Ifrane", fromDetail: "AUI main gate", toCity: "Casablanca", toDetail: "Maârif or Gauthier",
      departureAt: nextWeekday("fri", 16, 30), seatsTotal: 3, pricePerSeat: 150,
      carModel: "Dacia Duster", carColor: "Grey", notes: "Highway all the way, one coffee stop at Khouribga toll. AC works, promise.",
      isRecurring: true, recurrenceDays: ["fri"], status: "active", createdAt: daysAgo(30, 15),
    },
    {
      id: "r-rabat-fri", driverId: "u-omar",
      fromCity: "Ifrane", fromDetail: "Downtown, near La Paix", toCity: "Rabat", toDetail: "Agdal",
      departureAt: nextWeekday("fri", 17, 30), seatsTotal: 2, pricePerSeat: 120,
      carModel: "Volkswagen Golf 7", carColor: "Black", notes: "Two seats only, I keep the back seat free for bags.",
      isRecurring: true, recurrenceDays: ["fri"], status: "active", createdAt: daysAgo(25, 8),
    },
    {
      id: "r-airport-sat", driverId: "u-mehdi",
      fromCity: "Ifrane", fromDetail: "Building 39 parking", toCity: "Fès–Saïss Airport", toDetail: "Departures",
      departureAt: nextWeekday("sat", 6, 0), seatsTotal: 3, pricePerSeat: 80,
      carModel: "Fiat Tipo", carColor: "Silver", notes: "Early flight crew, this one's for you. I'll wait 5 minutes max.",
      isRecurring: false, recurrenceDays: [], status: "active", createdAt: daysAgo(3, 21),
    },
    {
      id: "r-fes-sun", driverId: "u-hamza",
      fromCity: "Fès", fromDetail: "Atlas roundabout", toCity: "Ifrane", toDetail: "AUI main gate",
      departureAt: nextWeekday("sun", 19, 0), seatsTotal: 3, pricePerSeat: 40,
      carModel: "Peugeot 208", carColor: "Blue", notes: "The Sunday return. Back on campus before curfew hours.",
      isRecurring: true, recurrenceDays: ["sun"], status: "active", createdAt: daysAgo(40, 18),
    },
    {
      id: "r-casa-sun", driverId: "u-yassine",
      fromCity: "Casablanca", fromDetail: "Oasis / Maârif pickup", toCity: "Ifrane", toDetail: "AUI main gate",
      departureAt: nextWeekday("sun", 17, 0), seatsTotal: 3, pricePerSeat: 150,
      carModel: "Dacia Duster", carColor: "Grey", notes: "Sunday return to campus. Leaving Casa at 5pm sharp.",
      isRecurring: true, recurrenceDays: ["sun"], status: "active", createdAt: daysAgo(30, 15),
    },
    {
      id: "r-marrakech", driverId: "u-mehdi",
      fromCity: "Ifrane", fromDetail: "AUI main gate", toCity: "Marrakech", toDetail: "Guéliz",
      departureAt: at(6, 9, 0), seatsTotal: 3, pricePerSeat: 220,
      carModel: "Fiat Tipo", carColor: "Silver", notes: "Long one. Leaving early, lunch stop in Beni Mellal.",
      isRecurring: false, recurrenceDays: [], status: "active", createdAt: daysAgo(2, 13),
    },
    // Demo user's own ride, with booking requests to manage
    {
      id: "r-demo-meknes", driverId: "u-demo",
      fromCity: "Ifrane", fromDetail: "AUI main gate", toCity: "Meknès", toDetail: "Ville nouvelle",
      departureAt: nextWeekday("fri", 15, 0), seatsTotal: 3, pricePerSeat: 40,
      carModel: "Renault Mégane", carColor: "Red", notes: "Room for small bags. Leaving from the main gate.",
      isRecurring: false, recurrenceDays: [], status: "active", createdAt: daysAgo(2, 10),
    },
    // Past ride so the review flow can be demoed
    {
      id: "r-past-fes", driverId: "u-salma",
      fromCity: "Ifrane", fromDetail: "AUI main gate", toCity: "Fès", toDetail: "Atlas",
      departureAt: daysAgo(3, 17), seatsTotal: 3, pricePerSeat: 40,
      carModel: "Renault Clio 4", carColor: "White", notes: null,
      isRecurring: false, recurrenceDays: [], status: "active", createdAt: daysAgo(10, 9),
    },
    {
      id: "r-past-casa", driverId: "u-yassine",
      fromCity: "Ifrane", fromDetail: "AUI main gate", toCity: "Casablanca", toDetail: "Maârif",
      departureAt: daysAgo(10, 16, ), seatsTotal: 3, pricePerSeat: 150,
      carModel: "Dacia Duster", carColor: "Grey", notes: null,
      isRecurring: false, recurrenceDays: [], status: "active", createdAt: daysAgo(17, 9),
    },
  ];

  const bookings: Booking[] = [
    // Demo user as passenger
    { id: "b-demo-casa", rideId: "r-casa-fri", passengerId: "u-demo", seats: 1, status: "accepted", createdAt: daysAgo(2, 11) },
    { id: "b-demo-marrakech", rideId: "r-marrakech", passengerId: "u-demo", seats: 1, status: "pending", createdAt: daysAgo(1, 19) },
    { id: "b-demo-past", rideId: "r-past-fes", passengerId: "u-demo", seats: 1, status: "accepted", createdAt: daysAgo(5, 8) },
    { id: "b-demo-past-casa", rideId: "r-past-casa", passengerId: "u-demo", seats: 1, status: "accepted", createdAt: daysAgo(12, 8) },
    // Requests on the demo user's own ride (driver view)
    { id: "b-aya-demo", rideId: "r-demo-meknes", passengerId: "u-aya", seats: 1, status: "pending", createdAt: daysAgo(0, 9) },
    { id: "b-rim-demo", rideId: "r-demo-meknes", passengerId: "u-rim", seats: 2, status: "accepted", createdAt: daysAgo(1, 16) },
    // Background bookings so seat counts look alive
    { id: "b-nour-rabat", rideId: "r-rabat-fri", passengerId: "u-nour", seats: 1, status: "accepted", createdAt: daysAgo(2, 12) },
    { id: "b-aya-fes", rideId: "r-fes-fri", passengerId: "u-aya", seats: 1, status: "accepted", createdAt: daysAgo(3, 14) },
    { id: "b-rim-casa", rideId: "r-casa-fri", passengerId: "u-rim", seats: 1, status: "accepted", createdAt: daysAgo(3, 10) },
    { id: "b-nour-past", rideId: "r-past-casa", passengerId: "u-nour", seats: 1, status: "accepted", createdAt: daysAgo(12, 10) },
  ];

  const requests: RideRequest[] = [
    {
      id: "q-nour-rabat", riderId: "u-nour", fromCity: "Ifrane", toCity: "Rabat",
      travelDate: ymd(2), timeOfDay: "afternoon", seats: 1,
      notes: "Finishing class at 2pm, flexible after that. Can share fuel + tolls.",
      status: "open", createdAt: daysAgo(0, 8),
    },
    {
      id: "q-aya-meknes", riderId: "u-aya", fromCity: "Ifrane", toCity: "Meknès",
      travelDate: ymd(3), timeOfDay: "morning", seats: 2,
      notes: "Me + my roommate, both with one small bag.",
      status: "open", createdAt: daysAgo(1, 13),
    },
    {
      id: "q-rim-ifrane", riderId: "u-rim", fromCity: "Casablanca", toCity: "Ifrane",
      travelDate: ymd(4), timeOfDay: "evening", seats: 1,
      notes: "Coming back to campus after a doctor's appointment.",
      status: "open", createdAt: daysAgo(0, 10),
    },
  ];

  const reviews: Review[] = [
    // Yassine as driver
    { id: "v1", bookingId: "b-x1", reviewerId: "u-rim", revieweeId: "u-yassine", reviewedAs: "driver", rating: 5, comment: "Super smooth drive to Casa, left exactly on time.", createdAt: daysAgo(20, 20) },
    { id: "v2", bookingId: "b-x2", reviewerId: "u-nour", revieweeId: "u-yassine", reviewedAs: "driver", rating: 5, comment: "Careful driver, good company, fair price.", createdAt: daysAgo(14, 21) },
    { id: "v3", bookingId: "b-x3", reviewerId: "u-aya", revieweeId: "u-yassine", reviewedAs: "driver", rating: 4, comment: "Great ride, just left 15 minutes late.", createdAt: daysAgo(7, 22) },
    // Salma as driver
    { id: "v4", bookingId: "b-x4", reviewerId: "u-aya", revieweeId: "u-salma", reviewedAs: "driver", rating: 5, comment: "My go-to for Fès. Always on time.", createdAt: daysAgo(9, 19) },
    { id: "v5", bookingId: "b-x5", reviewerId: "u-hamza", revieweeId: "u-salma", reviewedAs: "driver", rating: 5, comment: "Safe driving on the mountain road, would ride again.", createdAt: daysAgo(16, 18) },
    // Omar as driver
    { id: "v6", bookingId: "b-x6", reviewerId: "u-nour", revieweeId: "u-omar", reviewedAs: "driver", rating: 5, comment: "Very respectful, music at a civilized volume.", createdAt: daysAgo(11, 20) },
    { id: "v7", bookingId: "b-x7", reviewerId: "u-rim", revieweeId: "u-omar", reviewedAs: "driver", rating: 4, comment: null, createdAt: daysAgo(19, 17) },
    // Mehdi as driver
    { id: "v8", bookingId: "b-x8", reviewerId: "u-demo", revieweeId: "u-mehdi", reviewedAs: "driver", rating: 5, comment: "Marrakech and back, zero complaints.", createdAt: daysAgo(22, 21) },
    // Hamza as driver
    { id: "v9", bookingId: "b-x9", reviewerId: "u-salma", revieweeId: "u-hamza", reviewedAs: "driver", rating: 5, comment: "Reliable Sunday return, never missed one.", createdAt: daysAgo(13, 22) },
    // Passengers being reviewed
    { id: "v10", bookingId: "b-x10", reviewerId: "u-yassine", revieweeId: "u-demo", reviewedAs: "passenger", rating: 5, comment: "On time at the pickup, easy passenger.", createdAt: daysAgo(9, 22) },
    { id: "v11", bookingId: "b-x11", reviewerId: "u-salma", revieweeId: "u-aya", reviewedAs: "passenger", rating: 5, comment: "Punctual and friendly.", createdAt: daysAgo(8, 20) },
    { id: "v12", bookingId: "b-x12", reviewerId: "u-omar", revieweeId: "u-nour", reviewedAs: "passenger", rating: 5, comment: null, createdAt: daysAgo(10, 21) },
    // Demo user's past Casa ride already reviewed (shows the "done" state)
    { id: "v13", bookingId: "b-demo-past-casa", reviewerId: "u-demo", revieweeId: "u-yassine", reviewedAs: "driver", rating: 5, comment: "Great trip down to Casa.", createdAt: daysAgo(9, 12) },
  ];

  return { profiles, rides, bookings, requests, reviews, counter: 1 };
}
