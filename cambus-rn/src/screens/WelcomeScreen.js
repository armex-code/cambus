import React from 'react';
import { View } from 'react-native';
import Screen from '../components/Screen';
import Type from '../components/Type';
import Avatar from '../components/Avatar';
import Icon from '../components/Icon';
import Logo from '../components/Logo';
import Tap from '../components/Tap';
import Appear from '../components/Appear';
import { colors, shadow } from '../theme';
import { selection } from '../lib/haptics';
import { useApp, SCREENS } from '../context/AppContext';
import { personas, personaOrder } from '../data/personas';

function ChoiceCard({ icon, iconBg, iconColor = colors.white, title, sub, onPress, hint, primary }) {
  return (
    <Tap
      onPress={onPress}
      haptic={primary ? 'medium' : 'light'}
      accessibilityLabel={title}
      accessibilityHint={hint}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          padding: 18,
          borderRadius: 20,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        },
        shadow(1),
      ]}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={26} color={iconColor} />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Type w={700} size={17} color={colors.ink}>
          {title}
        </Type>
        <Type w={500} size={12.5} color={colors.muted}>
          {sub}
        </Type>
      </View>
      <Icon name="chevron-forward" size={20} color={colors.faint} />
    </Tap>
  );
}

export default function WelcomeScreen() {
  const { P, personaKey, navigate, setPersona } = useApp();

  return (
    <Screen>
      <View style={{ flex: 1 }}>
        {/* brand row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 8 }}>
          <Logo size={32} />
          <Type w={800} size={19} color={colors.ink} style={{ letterSpacing: -0.4 }}>
            Cambus
          </Type>
        </View>

        <View style={{ marginTop: 34, gap: 12 }}>
          <Avatar initial={P.initial} bg={P.avBg} size={68} style={shadow(1)} />
          <Type w={800} size={30} color={colors.ink} style={{ letterSpacing: -0.8 }}>
            Salam, {P.name}
          </Type>
          <Type w={500} size={15} color={colors.muted} style={{ lineHeight: 22 }}>
            Where are you headed this weekend? Carpool with fellow AUIers.
          </Type>
        </View>

        <View style={{ gap: 12, marginTop: 30 }}>
          <Appear index={0}>
            <ChoiceCard
              primary
              icon="search"
              iconBg={colors.primary}
              title="Find a seat"
              sub="Most students start here"
              hint="Set your ride style, then browse cars"
              onPress={() => navigate(SCREENS.STYLE)}
            />
          </Appear>
          <Appear index={1}>
            <ChoiceCard
              icon="car-sport"
              iconBg={colors.primaryTint}
              iconColor={colors.primary}
              title="Offer a ride"
              sub="Share seats, split fuel"
              hint="Post your car and set a fair price"
              onPress={() => navigate(SCREENS.DRIVER)}
            />
          </Appear>
        </View>

        <View style={{ flex: 1 }} />

        {/* Persona switcher — segmented, re-personalizes */}
        <Type w={700} size={11} color={colors.faint} style={{ letterSpacing: 0.4, marginBottom: 8 }}>
          VIEWING AS
        </Type>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.surface,
            borderRadius: 14,
            padding: 4,
            marginBottom: 16,
          }}
        >
          {personaOrder.map((k) => {
            const active = k === personaKey;
            return (
              <Tap
                key={k}
                haptic="selection"
                onPress={() => {
                  selection();
                  setPersona(k);
                }}
                accessibilityLabel={`View as ${personas[k].name}`}
                accessibilityState={{ selected: active }}
                style={[
                  {
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 11,
                    alignItems: 'center',
                    backgroundColor: active ? colors.card : 'transparent',
                  },
                  active ? shadow(1) : null,
                ]}
              >
                <Type w={700} size={13} color={active ? colors.primary : colors.muted}>
                  {personas[k].name}
                </Type>
              </Tap>
            );
          })}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Icon name="shield-checkmark" size={15} color={colors.positive} />
          <Type w={500} size={12} color={colors.muted}>
            {P.email} · AUI students only
          </Type>
        </View>
      </View>
    </Screen>
  );
}
