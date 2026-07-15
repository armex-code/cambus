import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { personas, prefDefs } from '../data/personas';

const AppContext = createContext(null);

export const SCREENS = {
  SPLASH: 'splash',
  ROLE: 'role',
  STYLE: 'style',
  HOME: 'home',
  RIDE: 'ride',
  RATE: 'rate',
  YOU: 'you',
  NOTIFS: 'notifs',
  DRIVER: 'driver',
};

// Fresh per-persona state, mirroring buildState() in the web prototype.
function buildPersonaState(key) {
  const P = personas[key] || personas.salma;
  return {
    prefs: Object.fromEntries(prefDefs.map((d) => [d[0], P.prefOn.includes(d[0])])),
    plan: P.plan,
    chatty: P.chatty,
    fare: P.fare,
    stars: 5,
    tags: { ontime: true, chat: true, clean: false },
    forgotten: {},
    swapped: {},
  };
}

export function AppProvider({ initialPersona = 'salma', children }) {
  const [personaKey, setPersonaKey] = useState(
    personas[initialPersona] ? initialPersona : 'salma'
  );
  const [screen, setScreen] = useState(SCREENS.SPLASH);
  const [history, setHistory] = useState([]);
  const [pstate, setPstate] = useState(() => buildPersonaState(initialPersona));

  const P = personas[personaKey];

  const navigate = useCallback(
    (next) => {
      setHistory((h) => [...h, screen]);
      setScreen(next);
    },
    [screen]
  );

  // Replace without recording history (used by the splash auto-advance).
  const replace = useCallback((next) => setScreen(next), []);

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const copy = [...h];
      const prev = copy.pop();
      setScreen(prev);
      return copy;
    });
  }, []);

  const setPersona = useCallback((key) => {
    if (!personas[key]) return;
    setPersonaKey(key);
    setPstate(buildPersonaState(key)); // re-personalize everything
  }, []);

  // ── state mutators ────────────────────────────────────────────
  const togglePref = useCallback(
    (key) => setPstate((s) => ({ ...s, prefs: { ...s.prefs, [key]: !s.prefs[key] } })),
    []
  );
  const setPlan = useCallback((v) => setPstate((s) => ({ ...s, plan: v })), []);
  const setChatty = useCallback((v) => setPstate((s) => ({ ...s, chatty: v })), []);
  const fareUp = useCallback(() => setPstate((s) => ({ ...s, fare: s.fare + 5 })), []);
  const fareDown = useCallback(
    () => setPstate((s) => ({ ...s, fare: Math.max(5, s.fare - 5) })),
    []
  );
  const setStars = useCallback((n) => setPstate((s) => ({ ...s, stars: n })), []);
  const toggleTag = useCallback(
    (key) => setPstate((s) => ({ ...s, tags: { ...s.tags, [key]: !s.tags[key] } })),
    []
  );
  const toggleForgotten = useCallback(
    (i) => setPstate((s) => ({ ...s, forgotten: { ...s.forgotten, [i]: !s.forgotten[i] } })),
    []
  );
  const toggleSwapped = useCallback(
    (k) => setPstate((s) => ({ ...s, swapped: { ...s.swapped, [k]: !s.swapped[k] } })),
    []
  );

  const value = useMemo(
    () => ({
      personaKey,
      P,
      screen,
      canGoBack: history.length > 0,
      navigate,
      replace,
      goBack,
      setPersona,
      ...pstate,
      togglePref,
      setPlan,
      setChatty,
      fareUp,
      fareDown,
      setStars,
      toggleTag,
      toggleForgotten,
      toggleSwapped,
    }),
    [
      personaKey, P, screen, history.length, navigate, replace, goBack, setPersona,
      pstate, togglePref, setPlan, setChatty, fareUp, fareDown, setStars,
      toggleTag, toggleForgotten, toggleSwapped,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
