import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import Screen from '../components/Screen';
import Type from '../components/Type';
import Avatar, { AvatarStack } from '../components/Avatar';
import Icon from '../components/Icon';
import Tap from '../components/Tap';
import Appear from '../components/Appear';
import { BackChevron } from '../components/UI';
import { colors, shadow } from '../theme';
import { useApp } from '../context/AppContext';

function ConfidenceBar({ conf, off }) {
  const w = useRef(new Animated.Value(off ? 0 : conf)).current;
  useEffect(() => {
    Animated.timing(w, { toValue: off ? 0 : conf, duration: 320, useNativeDriver: false }).start();
  }, [off, conf, w]);
  return (
    <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.surface, overflow: 'hidden' }}>
      <Animated.View
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.primary,
          width: w.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
        }}
      />
    </View>
  );
}

function DnaRow({ d, off, onToggle, index }) {
  return (
    <Appear index={index}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            padding: 15,
            borderRadius: 18,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            opacity: off ? 0.55 : 1,
          },
          shadow(1),
        ]}
      >
        <View style={{ flex: 1, gap: 8 }}>
          <Type w={700} size={13} color={colors.ink}>
            {d.title}
          </Type>
          <ConfidenceBar conf={d.conf} off={off} />
        </View>
        <Tap
          onPress={onToggle}
          haptic="selection"
          accessibilityLabel={off ? `Remember ${d.title}` : `Forget ${d.title}`}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 13,
            borderRadius: 999,
            backgroundColor: off ? colors.primaryTint : colors.surface,
          }}
        >
          <Type w={700} size={11.5} color={off ? colors.primary : colors.clay}>
            {off ? 'Undo' : 'Forget'}
          </Type>
        </Tap>
      </View>
    </Appear>
  );
}

function StatTile({ icon, iconColor, value, label, index }) {
  return (
    <Appear index={index} style={{ width: '48%' }}>
      <View
        style={[
          {
            padding: 16,
            borderRadius: 18,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            gap: 10,
          },
          shadow(1),
        ]}
      >
        <Icon name={icon} size={20} color={iconColor} />
        <View>
          <Type w={800} size={24} color={colors.ink}>
            {value}
          </Type>
          <Type w={500} size={11} color={colors.muted} style={{ marginTop: 2 }}>
            {label}
          </Type>
        </View>
      </View>
    </Appear>
  );
}

export default function ProfileScreen() {
  const { P, forgotten, toggleForgotten, goBack } = useApp();

  return (
    <Screen scroll>
      <View style={{ marginTop: 8 }}>
        <BackChevron onPress={goBack} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12 }}>
        <Avatar initial={P.initial} bg={P.avBg} size={56} style={shadow(1)} />
        <View style={{ gap: 3 }}>
          <Type w={800} size={19} color={colors.ink} style={{ letterSpacing: -0.3 }}>
            {P.name} {P.surnameNice}
          </Type>
          <Type w={500} size={12} color={colors.muted}>
            {P.major} · {P.bldgNice}
          </Type>
        </View>
      </View>

      {/* Cambus knows */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 28 }}>
        <Icon name="sparkles" size={16} color={colors.primary} />
        <Type w={800} size={16} color={colors.ink} style={{ letterSpacing: -0.3 }}>
          Cambus knows
        </Type>
      </View>
      <View style={{ gap: 10, marginTop: 12 }}>
        {P.dna.map((d, i) => (
          <DnaRow key={i} d={d} index={i} off={!!forgotten[i]} onToggle={() => toggleForgotten(i)} />
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 }}>
        <Icon name="lock-closed" size={12} color={colors.faint} />
        <Type w={500} size={11} color={colors.faint} style={{ flex: 1, lineHeight: 16 }}>
          Never collected: grades · location outside trips · messages
        </Type>
      </View>

      {/* This semester */}
      <Type w={800} size={16} color={colors.ink} style={{ marginTop: 26, letterSpacing: -0.3 }}>
        This semester
      </Type>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          rowGap: 10,
          marginTop: 12,
        }}
      >
        <StatTile index={0} icon="car-sport" iconColor={colors.primary} value={P.semester.trips} label="Carpools" />
        <StatTile index={1} icon="wallet" iconColor={colors.positive} value={P.semester.saved} label="MAD saved" />
        <StatTile index={2} icon="leaf" iconColor={colors.positive} value={P.semester.co2} label="kg CO₂ saved" />
        <StatTile index={3} icon="flame" iconColor={colors.amber} value={P.semester.streak} label="Week streak" />
      </View>

      {/* crew */}
      <View
        style={{
          marginTop: 12,
          padding: 16,
          borderRadius: 18,
          backgroundColor: colors.amberTint,
          borderWidth: 1,
          borderColor: colors.amberBorder,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <AvatarStack crew={P.crew} size={34} ringColor={colors.amberTint} />
        <Type w={600} size={12} color={colors.amberInk} style={{ flex: 1, lineHeight: 17 }}>
          {P.crewLine}
        </Type>
      </View>
    </Screen>
  );
}
