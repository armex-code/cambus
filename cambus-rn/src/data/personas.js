// Persona dataset, ported 1:1 from the Cambus web prototype.
// Each persona re-personalizes every screen in the app.

export const personas = {
  salma: {
    name: 'Salma', surnameNice: 'El Amrani', initial: 'S', avBg: '#0E8A57',
    email: 's.elamrani@aui.ma', major: "SSE '27", bldgNice: 'Bldg 8', homeNice: 'Maarif, Casa',
    destNice: 'Casa', destUpper: 'CASA', departNice: 'Fri 17:00',
    driverInitial: 'Y', drvBg: '#4A6FA5', driverNice: 'Yasmine drives · 4.9★',
    driverName: 'Yasmine', driverRating: '4.9',
    seatsLine: '1 seat left', fareShort: '85 MAD',
    crew: [
      { init: 'Y', bg: '#4A6FA5', name: 'Yasmine', tag: 'driver · 4.9★' },
      { init: 'R', bg: '#C4502F', name: 'Rim', tag: "SSE '27" },
      { init: 'K', bg: '#7A5EA8', name: 'Kenza', tag: 'Bldg 4' },
    ],
    crewLine: 'Your crew · 7 Fridays together',
    regularsShort: '3 regulars ride with you',
    moreCars: [
      { init: 'M', bg: '#B98A1C', name: "Mehdi's car", when: 'Fri 18:30', price: '80 MAD', seats: '2 seats' },
      { init: 'N', bg: '#C4502F', name: "Nada's car", when: 'Sat 09:00', price: '85 MAD', seats: '3 seats' },
    ],
    stopNice: 'Coffee stop near Khemisset — your usual. Shared live with Mama.',
    rateSubNice: "Yasmine's car · Ifrane → Casa",
    notifNice: 'Checkout is Friday. 14 of 22 Casa seats gone.',
    notifExtra: [
      { text: 'Finals end Thu 14:00 — leave earlier?' },
      { text: 'Dinner downtown? Last car back 23:00.' },
    ],
    dna: [
      { title: 'Fridays 17:00 → Casa', conf: 92 },
      { title: 'Coffee stop · Khemisset', conf: 85 },
      { title: 'Front seat', conf: 74 },
    ],
    swap: [
      { k: 'y', init: 'Y', avBg: '#4A6FA5', name: 'Yasmine' },
      { k: 'r', init: 'R', avBg: '#C4502F', name: 'Rim' },
      { k: 'kz', init: 'K', avBg: '#7A5EA8', name: 'Kenza' },
    ],
    semester: { trips: 14, saved: 610, co2: 38, streak: 7 },
    prefOn: ['safety', 'female', 'applepay'],
    plan: 25, chatty: 60,
    fare: 85, fairMin: 75, fairMax: 95,
  },
  omar: {
    name: 'Omar', surnameNice: 'Benjelloun', initial: 'O', avBg: '#B98A1C',
    email: 'o.benjelloun@aui.ma', major: "BBA '26", bldgNice: 'Bldg 36', homeNice: 'Agdal, Rabat',
    destNice: 'Rabat', destUpper: 'RABAT', departNice: 'Thu 18:00',
    driverInitial: 'H', drvBg: '#C4502F', driverNice: 'Hamza drives · 4.8★',
    driverName: 'Hamza', driverRating: '4.8',
    seatsLine: '2 seats left', fareShort: '60 MAD',
    crew: [
      { init: 'H', bg: '#C4502F', name: 'Hamza', tag: 'driver · 4.8★' },
      { init: 'S', bg: '#4A6FA5', name: 'Simo', tag: "BBA '26" },
      { init: 'Y', bg: '#7A5EA8', name: 'Youssef', tag: "BBA '27" },
    ],
    crewLine: 'Your crew · 9 Thursdays together',
    regularsShort: '4 regulars ride with you',
    moreCars: [
      { init: 'A', bg: '#4A6FA5', name: "Adam's car", when: 'Thu 19:00', price: '60 MAD', seats: '1 seat' },
      { init: 'T', bg: '#7A5EA8', name: "Tarik's car", when: 'Fri 12:00', price: '55 MAD', seats: '3 seats' },
    ],
    stopNice: 'Asr stop · Khemisset mosque — never skipped in 9 trips.',
    rateSubNice: "Hamza's car · Ifrane → Rabat",
    notifNice: 'Checkout is Friday. Rabat cars 60% full.',
    notifExtra: [
      { text: 'Final ends Wed noon — leave same day?' },
      { text: 'Football Sat 21:00 — Hamza returns Sunday.' },
    ],
    dna: [
      { title: 'Thursdays 18:00 → Rabat', conf: 95 },
      { title: 'Asr stop · Khemisset', conf: 98 },
      { title: 'Cash', conf: 100 },
    ],
    swap: [
      { k: 'h', init: 'H', avBg: '#C4502F', name: 'Hamza' },
      { k: 's', init: 'S', avBg: '#4A6FA5', name: 'Simo' },
      { k: 'y', init: 'Y', avBg: '#7A5EA8', name: 'Youssef' },
    ],
    semester: { trips: 21, saved: 480, co2: 52, streak: 9 },
    prefOn: ['budget', 'cash'],
    plan: 74, chatty: 88,
    fare: 60, fairMin: 50, fairMax: 70,
  },
  aya: {
    name: 'Aya', surnameNice: 'Tazi', initial: 'A', avBg: '#7A5EA8',
    email: 'a.tazi@aui.ma', major: "CS '28", bldgNice: 'Bldg 26', homeNice: 'Guéliz, Marrakech',
    destNice: 'Marrakech', destUpper: 'MARRAKECH', departNice: 'Fri 15:00',
    driverInitial: 'S', drvBg: '#0E8A57', driverNice: 'Sara drives · 5.0★',
    driverName: 'Sara', driverRating: '5.0',
    seatsLine: '1 seat left', fareShort: '150 MAD',
    crew: [
      { init: 'S', bg: '#0E8A57', name: 'Sara', tag: 'driver · 5.0★' },
      { init: 'I', bg: '#4A6FA5', name: 'Imane', tag: "CS '28" },
    ],
    crewLine: 'Your crew · women-only, always',
    regularsShort: '2 regulars ride with you',
    moreCars: [
      { init: 'L', bg: '#C4502F', name: "Lina's car", when: 'Fri 16:00', price: '150 MAD', seats: '2 seats' },
      { init: 'D', bg: '#B98A1C', name: "Dounia's car", when: 'Sat 08:00', price: '140 MAD', seats: '1 seat' },
    ],
    stopNice: 'Direct · quiet car · shared live with Mama.',
    rateSubNice: "Sara's car · Ifrane → Marrakech",
    notifNice: 'Checkout is Friday. 2 women-only cars left.',
    notifExtra: [
      { text: 'Final ends Thu 10:00 — Sara drives at noon.' },
      { text: 'Quiet car confirmed — both riders women.' },
    ],
    dna: [
      { title: 'Women-only car', conf: 100 },
      { title: 'Fridays 15:00 → Marrakech', conf: 88 },
      { title: 'Live-share with Mama', conf: 100 },
    ],
    swap: [
      { k: 's', init: 'S', avBg: '#0E8A57', name: 'Sara' },
      { k: 'i', init: 'I', avBg: '#4A6FA5', name: 'Imane' },
    ],
    semester: { trips: 8, saved: 720, co2: 41, streak: 4 },
    prefOn: ['safety', 'female', 'applepay'],
    plan: 12, chatty: 18,
    fare: 150, fairMin: 140, fairMax: 160,
  },
};

// [key, label, Ionicons name]
export const prefDefs = [
  ['safety', 'Safety checks', 'shield-checkmark'],
  ['female', 'Women only', 'female'],
  ['cash', 'Cash ok', 'cash'],
  ['applepay', 'Apple Pay', 'card'],
];

export const personaOrder = ['salma', 'omar', 'aya'];
