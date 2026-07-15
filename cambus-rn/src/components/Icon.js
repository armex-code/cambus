import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Single icon primitive — one family (Ionicons), consistent sizing, so the
// whole app shares one visual language instead of stray unicode glyphs.
export default function Icon({ name, size = 22, color = colors.ink, style }) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
