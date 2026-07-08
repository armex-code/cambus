export const CITIES = [
  "Ifrane",
  "Azrou",
  "Fès",
  "Meknès",
  "El Hajeb",
  "Rabat",
  "Casablanca",
  "Marrakech",
  "Tanger",
  "Kénitra",
  "Fès–Saïss Airport",
  "Casablanca Airport (CMN)",
] as const;

export type City = (typeof CITIES)[number];

/** Typical grand-taxi / bus price context so drivers price fairly. */
export const PRICE_HINTS: Record<string, { low: number; high: number }> = {
  "Ifrane→Azrou": { low: 10, high: 20 },
  "Ifrane→Fès": { low: 30, high: 50 },
  "Ifrane→Meknès": { low: 30, high: 50 },
  "Ifrane→El Hajeb": { low: 15, high: 30 },
  "Ifrane→Rabat": { low: 80, high: 130 },
  "Ifrane→Casablanca": { low: 110, high: 170 },
  "Ifrane→Marrakech": { low: 170, high: 250 },
  "Ifrane→Tanger": { low: 150, high: 220 },
  "Ifrane→Kénitra": { low: 80, high: 120 },
  "Ifrane→Fès–Saïss Airport": { low: 60, high: 90 },
  "Ifrane→Casablanca Airport (CMN)": { low: 130, high: 190 },
};

export function priceHint(from: string, to: string) {
  return (
    PRICE_HINTS[`${from}→${to}`] ??
    PRICE_HINTS[`${to}→${from}`] ??
    null
  );
}

const COORDS: Record<City, [number, number]> = {
  Ifrane: [33.533, -5.107],
  Azrou: [33.436, -5.221],
  "Fès": [34.033, -5.0],
  "Meknès": [33.895, -5.554],
  "El Hajeb": [33.686, -5.371],
  Rabat: [34.021, -6.841],
  Casablanca: [33.573, -7.59],
  Marrakech: [31.63, -8.008],
  Tanger: [35.76, -5.834],
  "Kénitra": [34.261, -6.58],
  "Fès–Saïss Airport": [33.927, -4.978],
  "Casablanca Airport (CMN)": [33.367, -7.59],
};

/** Rough road distance: haversine + 30% winding factor. */
export function roadKm(from: string, to: string): number | null {
  const a = COORDS[from as City];
  const b = COORDS[to as City];
  if (!a || !b) return null;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  const straight = 2 * 6371 * Math.asin(Math.sqrt(h));
  return Math.round(straight * 1.3);
}

/**
 * Suggested fair price per seat: curated student-market ranges for the
 * common routes, distance-based estimate (base + per-km share of fuel and
 * tolls) for everything else. Always the driver's call.
 */
export function suggestedPrice(from: string, to: string): number | null {
  const round5 = (n: number) => Math.max(5, Math.round(n / 5) * 5);
  const hint = priceHint(from, to);
  if (hint) return round5((hint.low + hint.high) / 2);
  const km = roadKm(from, to);
  if (km === null || km === 0) return null;
  return round5(10 + km * 0.43);
}

export const POPULAR_ROUTES: { from: City; to: City; note: string }[] = [
  { from: "Ifrane", to: "Fès", note: "The weekend classic, about 1 hour" },
  { from: "Ifrane", to: "Meknès", note: "Around 1 hour through El Hajeb" },
  { from: "Ifrane", to: "Casablanca", note: "3.5 hours door to door" },
  { from: "Ifrane", to: "Rabat", note: "2.5 hours on the highway" },
];
