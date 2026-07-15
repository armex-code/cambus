import React from 'react';
import { Text } from 'react-native';
import { font, colors } from '../theme';

// Plus Jakarta Sans text with weight helpers so screens read cleanly.
const weightMap = {
  400: font.regular,
  500: font.medium,
  600: font.semibold,
  700: font.bold,
  800: font.extra,
};

export default function Type({ w = 400, size = 14, color = colors.ink, style, children, ...rest }) {
  return (
    <Text
      allowFontScaling={false}
      style={[{ fontFamily: weightMap[w] || font.regular, fontSize: size, color }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
