import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// Tracks the OS "Reduce Motion" setting so animations can honor it (WCAG,
// Apple Reduced Motion). Returns true when the user prefers reduced motion.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((v) => {
      if (mounted) setReduced(!!v);
    });
    const sub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (v) =>
      setReduced(!!v)
    );
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);

  return reduced;
}

// Shared motion tokens so every animation shares one rhythm.
export const motion = {
  enter: 260,
  exit: 180, // exit shorter than enter (MD motion)
  press: 90,
  stagger: 45, // per-item list entrance delay
};
