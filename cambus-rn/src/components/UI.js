import React from 'react';
import { View } from 'react-native';
import Tap from './Tap';
import Type from './Type';
import Icon from './Icon';
import { colors, shadow, brandShadow } from '../theme';

// Primary solid-blue CTA. One per screen (primary-action rule).
export function PrimaryButton({ label, onPress, icon = 'arrow-forward', style, accessibilityHint }) {
  return (
    <Tap
      onPress={onPress}
      haptic="medium"
      scaleTo={0.98}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={[
        {
          height: 56,
          borderRadius: 16,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
        },
        brandShadow(),
        style,
      ]}
    >
      <Type w={700} size={16} color={colors.white}>
        {label}
      </Type>
      {icon ? <Icon name={icon} size={18} color={colors.white} /> : null}
    </Tap>
  );
}

// Outlined (ghost) secondary button.
export function GhostButton({ label, onPress, icon = 'arrow-forward', style, accessibilityHint }) {
  return (
    <Tap
      onPress={onPress}
      scaleTo={0.98}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={[
        {
          height: 54,
          borderRadius: 16,
          borderWidth: 1.5,
          borderColor: colors.border,
          backgroundColor: colors.card,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
        },
        style,
      ]}
    >
      <Type w={700} size={15} color={colors.primary}>
        {label}
      </Type>
      {icon ? <Icon name={icon} size={17} color={colors.primary} /> : null}
    </Tap>
  );
}

// A card surface. `elevated` gives it a soft, consistent drop shadow.
export function Card({ children, style, elevated = false }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.border,
        },
        elevated && shadow(2),
        style,
      ]}
    >
      {children}
    </View>
  );
}

// Circular back button (BlaBlaCar-style chip) with a proper 44pt target.
export function BackChevron({ onPress, style }) {
  return (
    <Tap
      onPress={onPress}
      haptic="selection"
      hitSlop={10}
      accessibilityLabel="Go back"
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          marginLeft: -4,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Icon name="chevron-back" size={22} color={colors.ink} />
    </Tap>
  );
}

// Uppercase eyebrow label.
export function Eyebrow({ children, color = colors.faint, style }) {
  return (
    <Type w={700} size={11} color={color} style={[{ letterSpacing: 0.6 }, style]}>
      {children}
    </Type>
  );
}

export { shadow, brandShadow };
