import React from 'react';
import { View } from 'react-native';
import Screen from '../components/Screen';
import Type from '../components/Type';
import { AvatarStack } from '../components/Avatar';
import Icon from '../components/Icon';
import Tap from '../components/Tap';
import { BackChevron, PrimaryButton } from '../components/UI';
import { colors, shadow } from '../theme';
import { success } from '../lib/haptics';
import { useApp, SCREENS } from '../context/AppContext';

function Stepper({ icon, onPress, hint }) {
  return (
    <Tap
      onPress={onPress}
      haptic="light"
      scaleTo={0.88}
      accessibilityLabel={hint}
      style={[
        {
          width: 54,
          height: 54,
          borderRadius: 27,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        },
        shadow(1),
      ]}
    >
      <Icon name={icon} size={22} color={colors.primary} />
    </Tap>
  );
}

export default function DriverScreen() {
  const { P, fare, fareUp, fareDown, navigate, goBack } = useApp();

  const ok = fare >= P.fairMin && fare <= P.fairMax;
  const hint = ok ? 'Fair split · fuel + tolls' : fare > P.fairMax ? 'Above fair split' : 'Below cost';
  const hintTint = ok ? colors.positiveTint : colors.amberTint;
  const hintFg = ok ? colors.positiveDark : colors.amberInk;
  const hintIcon = ok ? 'checkmark-circle' : 'alert-circle';

  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 8 }}>
          <BackChevron onPress={goBack} />
        </View>
        <Type w={800} size={26} color={colors.ink} style={{ letterSpacing: -0.6, marginTop: 14 }}>
          Offer a ride
        </Type>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <Icon name="navigate" size={14} color={colors.muted} />
          <Type w={500} size={13} color={colors.muted}>
            Ifrane → {P.destNice} · {P.departNice}
          </Type>
        </View>

        {/* regulars */}
        <View
          style={{
            marginTop: 22,
            paddingVertical: 15,
            paddingHorizontal: 16,
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
          <Type w={600} size={12.5} color={colors.amberInk} style={{ flex: 1 }}>
            {P.regularsShort}
          </Type>
        </View>

        {/* price per seat */}
        <View
          style={[
            {
              marginTop: 16,
              paddingVertical: 28,
              paddingHorizontal: 22,
              borderRadius: 22,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              gap: 18,
            },
            shadow(2),
          ]}
        >
          <Type w={700} size={12} color={colors.faint} style={{ letterSpacing: 0.6 }}>
            PRICE PER SEAT
          </Type>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 26 }}>
            <Stepper icon="remove" onPress={fareDown} hint="Decrease price by 5 dirham" />
            <View
              style={{ alignItems: 'center', minWidth: 110 }}
              accessible
              accessibilityLabel={`${fare} dirham per seat`}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Type w={800} size={52} color={colors.primary} style={{ letterSpacing: -2 }}>
                  {fare}
                </Type>
              </View>
              <Type w={600} size={11} color={colors.muted} style={{ letterSpacing: 1, marginTop: 2 }}>
                MAD
              </Type>
            </View>
            <Stepper icon="add" onPress={fareUp} hint="Increase price by 5 dirham" />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 999,
              backgroundColor: hintTint,
            }}
          >
            <Icon name={hintIcon} size={15} color={hintFg} />
            <Type w={600} size={12} color={hintFg}>
              {hint}
            </Type>
          </View>
        </View>

        <View style={{ flex: 1 }} />
        <PrimaryButton
          label="Post my car"
          accessibilityHint="Publish your car so students can book a seat"
          onPress={() => {
            success();
            navigate(SCREENS.HOME);
          }}
        />
      </View>
    </Screen>
  );
}
