# Cambus

**Carpooling for Al Akhawayn University students.** Ifrane is remote — every
weekend students head to Casa, Rabat, Marrakech and back. Cambus turns that into
a trusted, student-only carpool: verified `@aui.ma` accounts, drivers you
recognize, fair fuel-split pricing, and a book-your-usual-seat flow that learns
your habits.

This repository holds the **React Native mobile app** (the current product) plus
the **original clickable prototype** it was built from.

> The previous Next.js web version of this project is preserved on the
> [`webapp-archive`](../../tree/webapp-archive) branch.

---

## What's inside

```
cambus/
├── cambus-rn/        # 📱 the mobile app — Expo / React Native
├── prototype/        # 🎨 original prototype: HTML decks, screens, pitch assets
└── README.md
```

---

## The app (`cambus-rn/`)

Expo + React Native. Nine screens, three switchable demo personas, and a design
system of its own — emerald green, warm sand accent, a custom route-pin mark, and
**Plus Jakarta Sans** throughout.

**Flow:** splash → welcome → ride style → home (your usual car) → in the car →
rate + swap contacts, plus **profile**, **alerts**, and **offer-a-ride (driver)**.

### Run it

```bash
cd cambus-rn
npm install
npx expo start        # press i / a, or scan the QR with Expo Go
npx expo start --web  # or run it in the browser
```

### Highlights

- **Its own identity** — single-green brand, custom SVG logo (an origin dot, a
  dotted road, a destination pin), friendly geometric type. No stock-template feel.
- **Three personas** (Salma / Omar / Aya) — tap *Viewing as* on the welcome screen
  and every screen re-personalizes: driver, destination, fare, crew, data-DNA, stats.
- **Real interactions** — spring press-physics + haptics on every control,
  staggered list entrances, animated confidence bars and fare fairness hints.
- **Accessible** — labels/roles/state on all controls, ≥44pt touch targets,
  reduced-motion support, WCAG-minded contrast.
- **Trust-first product** — AUI-only verification, women-only ride option, live
  trip sharing, transparent "what Cambus knows" with per-item *forget*.

### Tech

Expo SDK 52 · React Native 0.76 · Plus Jakarta Sans (`@expo-google-fonts`) ·
Ionicons (`@expo/vector-icons`) · `react-native-svg` · `@react-native-community/slider` ·
`expo-haptics` · a lightweight state-machine router with a shared design-token layer.

```
cambus-rn/src/
├── theme.js              # colors, type, shadow scale (single source of truth)
├── data/personas.js      # the three personas + preferences
├── context/AppContext.js # persona state, prefs/fare/rating, navigation
├── components/           # Logo, Type, Icon, Avatar, Tap, Appear, Screen, UI kit
└── screens/              # one file per screen
```

---

## The prototype (`prototype/`)

The original clickable prototype and pitch materials the app was designed from —
self-contained HTML decks (`Cambus v4.dc.html` is the latest), the interactive
data model, an iOS device frame, and screenshots of every screen.

---

## Status

Design-complete interactive prototype. Screens are data-driven and personalized;
backend (auth, matching, payments) is not yet wired — this is the product and
design foundation to build on.

---

<sub>Built for AUI students · Ifrane, Morocco 🇲🇦</sub>
