import React from 'react';
import { View } from 'react-native';
import Screen from '../components/Screen';
import Type from '../components/Type';
import Icon from '../components/Icon';
import Tap from '../components/Tap';
import Appear from '../components/Appear';
import { BackChevron } from '../components/UI';
import { colors, shadow, brandShadow } from '../theme';
import { useApp, SCREENS } from '../context/AppContext';

export default function AlertsScreen() {
  const { P, navigate, goBack } = useApp();

  return (
    <Screen>
      <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <BackChevron onPress={goBack} />
        <Type w={800} size={22} color={colors.ink} style={{ letterSpacing: -0.4 }}>
          For you
        </Type>
      </View>

      <View style={{ gap: 12, marginTop: 20 }}>
        {/* primary alert */}
        <Appear index={0}>
          <View
            style={[
              {
                padding: 18,
                borderRadius: 20,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                gap: 12,
              },
              shadow(2),
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 9,
                  backgroundColor: colors.primaryTint,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="sparkles" size={15} color={colors.primary} />
              </View>
              <Type w={700} size={12.5} color={colors.primary}>
                Cambus
              </Type>
            </View>
            <Type w={600} size={14.5} color={colors.ink} style={{ lineHeight: 22 }}>
              {P.notifNice}
            </Type>
            <Tap
              onPress={() => navigate(SCREENS.HOME)}
              haptic="medium"
              accessibilityLabel="See cars"
              style={[
                {
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 11,
                  paddingHorizontal: 18,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                },
                brandShadow(),
              ]}
            >
              <Type w={700} size={13} color={colors.white}>
                See cars
              </Type>
              <Icon name="arrow-forward" size={15} color={colors.white} />
            </Tap>
          </View>
        </Appear>

        {/* secondary alerts */}
        {P.notifExtra.map((nx, i) => (
          <Appear key={i} index={i + 1}>
            <View
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 13,
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  borderRadius: 18,
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
                shadow(1),
              ]}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: colors.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="notifications" size={17} color={colors.muted} />
              </View>
              <Type w={500} size={13} color={colors.slate} style={{ flex: 1, lineHeight: 19 }}>
                {nx.text}
              </Type>
            </View>
          </Appear>
        ))}
      </View>
    </Screen>
  );
}
