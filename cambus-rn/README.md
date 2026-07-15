# Cambus — mobile app

AUI student carpooling, built with Expo / React Native. Nine screens, three
switchable demo personas, and a self-owned design system: a single emerald green
brand, a warm sand accent, a custom route-pin logo, and **Plus Jakarta Sans**.

## Run

```bash
npm install
npx expo start        # press i (iOS) / a (Android), or scan with Expo Go
npx expo start --web  # or run in the browser
```

> On a version-mismatch warning for a native module, run `npx expo install --fix` once.

## Flow

`splash → welcome → ride style → home → in the car → rate + swap`, plus
**profile**, **alerts**, and **offer a ride (driver)**.

Tap **Viewing as · Salma / Omar / Aya** on the welcome screen — every screen
re-personalizes (driver, destination, fare, crew, data-DNA, stats).

## Structure

```
App.js                     fonts + providers + screen router (+ Android back)
src/
  theme.js                 design tokens — colors, type, shadow scale
  data/personas.js         the three personas + preference defs
  context/AppContext.js    persona state, prefs/fare/rating state, navigation
  components/              Logo, Type, Icon, Avatar, Tap, Appear, Screen, UI kit
  screens/                one file per screen
```

## Design system

- **One brand color** — emerald green (`#0F9D63`) for every primary action and
  positive signal; warm sand/amber (`#E8912A`) is the only secondary accent. No blue.
- **Custom logo** (`components/Logo.js`) — an SVG route mark: origin dot → dotted
  road → destination pin. Rendered as an app-icon tile or a bare glyph.
- **Type** — Plus Jakarta Sans, weights 400–800, via `@expo-google-fonts`.
- **Icons** — one family (Ionicons via `@expo/vector-icons`); no emoji/unicode glyphs.
- **Motion & feel** — spring press-physics + haptics on every control, staggered
  list entrances, animated confidence bars — all reduced-motion aware.
- **Accessibility** — labels/roles/state on controls, ≥44pt targets, WCAG contrast.

## Dependencies

Expo SDK 52 · React Native 0.76 · `react-native-svg` · `@react-native-community/slider` ·
`expo-haptics` · `@expo/vector-icons` · `@expo-google-fonts/plus-jakarta-sans` ·
`react-native-safe-area-context`.
