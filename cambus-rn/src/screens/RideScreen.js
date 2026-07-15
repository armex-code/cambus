import React from 'react';
import { View } from 'react-native';
import Screen from '../components/Screen';
import Type from '../components/Type';
import Avatar from '../components/Avatar';
import Icon from '../components/Icon';
import Tap from '../components/Tap';
import Appear from '../components/Appear';
import { GhostButton, Card } from '../components/UI';
import { colors, shadow } from '../theme';
import { useApp, SCREENS } from '../context/AppContext';

function SeatTile({ init, name, tag, avBg, isYou, index }) {
  return (
    <Appear
      index={index}
      style={{
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 11,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: isYou ? colors.primaryTint : colors.surface,
        borderWidth: 1.5,
        borderColor: isYou ? colors.primary : colors.hair,
        borderStyle: isYou ? 'dashed' : 'solid',
      }}
    >
      <Avatar initial={init} bg={avBg} size={30} />
      <View style={{ flexShrink: 1 }}>
        <Type w={700} size={12} color={colors.ink}>
          {name}
        </Type>
        <Type w={500} size={10} color={colors.muted}>
          {tag}
        </Type>
      </View>
    </Appear>
  );
}

export default function RideScreen() {
  const { P, navigate } = useApp();

  const seats = [
    ...P.crew.map((c) => ({ init: c.init, name: c.name, tag: c.tag, avBg: c.bg, isYou: false })),
    { init: P.initial, name: 'You', tag: 'Your seat', avBg: P.avBg, isYou: true },
  ];

  return (
    <Screen>
      <View style={{ flex: 1 }}>
        {/* success header */}
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <View
            style={[
              {
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.positive,
                alignItems: 'center',
                justifyContent: 'center',
              },
              shadow(2),
            ]}
          >
            <Icon name="checkmark" size={32} color={colors.white} />
          </View>
          <Type w={800} size={26} color={colors.ink} style={{ marginTop: 14, letterSpacing: -0.5 }}>
            You're in!
          </Type>
          <Type w={500} size={13} color={colors.muted} style={{ marginTop: 4 }}>
            {P.departNice} · Gate 2
          </Type>
        </View>

        {/* ticket */}
        <Card elevated style={{ marginTop: 22, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.positive }} />
            <Type w={800} size={19} color={colors.ink}>
              Ifrane
            </Type>
            <View
              style={{
                flex: 1,
                borderTopWidth: 1.5,
                borderColor: colors.hair,
                borderStyle: 'dashed',
                alignItems: 'center',
              }}
            >
              <Type
                w={700}
                size={10.5}
                color={colors.primary}
                style={{
                  position: 'absolute',
                  top: -8,
                  backgroundColor: colors.card,
                  paddingHorizontal: 6,
                }}
              >
                {P.departNice}
              </Type>
            </View>
            <Type w={800} size={19} color={colors.ink}>
              {P.destNice}
            </Type>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.ink }} />
          </View>

          {/* seat map */}
          <Type w={700} size={11} color={colors.faint} style={{ letterSpacing: 0.6, marginTop: 20 }}>
            THE CAR
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
            {seats.map((s, i) => (
              <SeatTile key={i} index={i} {...s} />
            ))}
          </View>
        </Card>

        <View
          style={{
            marginTop: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingVertical: 13,
            paddingHorizontal: 15,
            borderRadius: 16,
            backgroundColor: colors.positiveTint,
          }}
        >
          <Icon name="cafe" size={17} color={colors.positiveDark} />
          <Type w={500} size={12} color={colors.positiveDark} style={{ flex: 1, lineHeight: 18 }}>
            {P.stopNice}
          </Type>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          {[
            { label: 'Message', icon: 'chatbubble-ellipses-outline' },
            { label: 'Share trip', icon: 'share-social-outline' },
          ].map((b) => (
            <Tap
              key={b.label}
              onPress={() => {}}
              accessibilityLabel={b.label}
              style={{
                flex: 1,
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                backgroundColor: colors.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Icon name={b.icon} size={18} color={colors.ink} />
              <Type w={700} size={13} color={colors.ink}>
                {b.label}
              </Type>
            </Tap>
          ))}
        </View>

        <View style={{ flex: 1 }} />
        <GhostButton
          label="Simulate arrival"
          accessibilityHint="Preview the rate-your-ride screen"
          onPress={() => navigate(SCREENS.RATE)}
        />
      </View>
    </Screen>
  );
}
