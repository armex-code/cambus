import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors } from '../theme';

// Cambus mark — a shared journey: an origin node, a dotted road, and a
// destination pin. Ownable and on-theme for campus carpooling (no stock car).
// `tile` renders it inside a rounded app-icon square; otherwise just the glyph.
function Glyph({ size, color, holeColor }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* origin node */}
      <Circle cx="14" cy="35" r="3.4" fill={color} />
      {/* dotted road climbing to the destination */}
      <Path
        d="M14 31 C 14 23 20 24 24 21"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="0.2 6"
        fill="none"
      />
      {/* destination pin */}
      <Path
        d="M31 9c4.6 0 8.2 3.5 8.2 7.9 0 5.7-8.2 13.1-8.2 13.1s-8.2-7.4-8.2-13.1C22.8 12.5 26.4 9 31 9z"
        fill={color}
      />
      <Circle cx="31" cy="16.7" r="3" fill={holeColor} />
    </Svg>
  );
}

export default function Logo({ size = 32, color = colors.white, tileColor = colors.primary, tile = true }) {
  if (!tile) return <Glyph size={size} color={color} holeColor={tileColor} />;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        backgroundColor: tileColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Glyph size={size * 0.74} color={color} holeColor={tileColor} />
    </View>
  );
}
