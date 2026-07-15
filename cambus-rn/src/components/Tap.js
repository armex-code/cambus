import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { tapLight, tapMedium, selection } from '../lib/haptics';
import { motion } from '../lib/motion';

const HAPTIC = { light: tapLight, medium: tapMedium, selection };

// Layout props that must live on the Pressable (the flex child) so the tap
// target participates in its parent's layout, not just the inner scaled view.
const LAYOUT_KEYS = ['flex', 'flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'width'];
function splitLayout(style) {
  const flat = StyleSheet.flatten(style) || {};
  const outer = {};
  for (const k of LAYOUT_KEYS) if (flat[k] != null) outer[k] = flat[k];
  return outer;
}

// The one tappable primitive for the whole app: a spring-scaled press with
// opacity dip, haptic feedback, generous hit area, and real a11y semantics.
// Keeps interactions consistent and on-spec (HIG/MD state layers + touch size).
export default function Tap({
  children,
  onPress,
  style,
  scaleTo = 0.97,
  haptic = 'light',
  hitSlop = 8,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  accessibilityState,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = (to) =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  const handlePress = (e) => {
    if (disabled) return;
    HAPTIC[haptic]?.();
    onPress?.(e);
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => !disabled && animate(scaleTo)}
      onPressOut={() => animate(1)}
      hitSlop={hitSlop}
      disabled={disabled}
      style={splitLayout(style)}
      accessible
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, ...accessibilityState }}
    >
      <Animated.View
        style={[{ transform: [{ scale }], opacity: disabled ? 0.5 : 1 }, style]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
