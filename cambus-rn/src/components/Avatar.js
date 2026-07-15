import React from 'react';
import { View } from 'react-native';
import Type from './Type';
import { colors } from '../theme';

// A round initial-avatar. Sizes drive the font so it scales nicely.
export default function Avatar({ initial, bg, size = 46, fg = colors.white, style, ring }) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        ring && { borderWidth: ring.width, borderColor: ring.color },
        style,
      ]}
    >
      <Type w={700} size={size * 0.4} color={fg}>
        {initial}
      </Type>
    </View>
  );
}

// Overlapping stack of crew avatars + optional trailing "+ seat" node.
export function AvatarStack({ crew, size = 34, ringColor = colors.card, addSeat = false }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {crew.map((c, i) => (
        <Avatar
          key={`${c.init}-${i}`}
          initial={c.init}
          bg={c.bg}
          size={size}
          ring={{ width: 2.5, color: ringColor }}
          style={{ marginLeft: i === 0 ? 0 : -8 }}
        />
      ))}
      {addSeat && (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.positiveTint,
            borderWidth: 2,
            borderColor: colors.positive,
            borderStyle: 'dashed',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: -8,
          }}
        >
          <Type w={700} size={15} color={colors.positiveDark}>
            +
          </Type>
        </View>
      )}
    </View>
  );
}
