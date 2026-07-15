// Cambus design tokens — its own identity: a single confident emerald green as
// the brand, warm green-tinted neutrals, and a sand/amber as the ONLY secondary
// accent. No blue anywhere. Clean white surfaces, friendly geometric sans.

const GREEN = '#0F9D63';
const GREEN_DARK = '#0B7A4C';
const GREEN_TINT = '#E6F6EE';

export const colors = {
  // ── Brand (emerald) ─────────────────────────────────
  primary: GREEN,
  primaryDark: GREEN_DARK,
  primaryTint: GREEN_TINT,
  primarySoft: '#F1FAF5',

  // ── Ink / text (dark pine-charcoal, warm not blue) ──
  ink: '#13241C',
  slate: '#33453B',
  muted: '#5F6E64',
  faint: '#98A69D',

  // ── Surfaces (subtle green-tinted neutrals) ─────────
  bg: '#FFFFFF',
  surface: '#F1F5F2',
  card: '#FFFFFF',
  border: '#E4EAE5',
  hair: '#EDF1EE',

  // ── Positive / eco = the same green (one brand color)
  positive: GREEN,
  positiveDark: GREEN_DARK,
  positiveTint: GREEN_TINT,

  // ── Warm accent (crew, streak) — the only 2nd colour
  amber: '#E8912A',
  amberInk: '#8A5412',
  amberMute: '#94724A',
  amberTint: '#FDF3E4',
  amberBorder: '#F4DEBB',

  // ── Rating (warm gold) ──────────────────────────────
  star: '#F2A81E',
  starOff: '#DCE3DD',

  // ── Danger ──────────────────────────────────────────
  red: '#E4574C',
  clay: '#D6653F',
  clayBorder: '#EFCBBB',

  white: '#FFFFFF',
};

export const font = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extra: 'PlusJakartaSans_800ExtraBold',
};

// Soft, low shadows (warm dark, so surfaces float gently).
export function shadow(level = 1) {
  if (level === 0) return {};
  const map = {
    1: { o: 0.05, r: 12, h: 4, e: 2 },
    2: { o: 0.08, r: 22, h: 10, e: 5 },
    3: { o: 0.12, r: 30, h: 16, e: 8 },
  };
  const s = map[level] || map[1];
  return {
    shadowColor: '#12271C',
    shadowOpacity: s.o,
    shadowRadius: s.r,
    shadowOffset: { width: 0, height: s.h },
    elevation: s.e,
  };
}

// Colored shadow under primary CTAs.
export function brandShadow() {
  return {
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  };
}
