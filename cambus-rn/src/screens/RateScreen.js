import React from 'react';
import { View } from 'react-native';
import Screen from '../components/Screen';
import Type from '../components/Type';
import Avatar from '../components/Avatar';
import Icon from '../components/Icon';
import Tap from '../components/Tap';
import Appear from '../components/Appear';
import { PrimaryButton } from '../components/UI';
import { colors, shadow } from '../theme';
import { selection, success } from '../lib/haptics';
import { useApp, SCREENS } from '../context/AppContext';

const TAG_DEFS = [
  ['ontime', 'On time'],
  ['chat', 'Good company'],
  ['clean', 'Clean car'],
];

export default function RateScreen() {
  const { P, stars, setStars, tags, toggleTag, swapped, toggleSwapped, navigate } = useApp();

  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <Avatar initial={P.driverInitial} bg={P.drvBg} size={60} style={shadow(1)} />
          <Type w={800} size={24} color={colors.ink} style={{ marginTop: 14, letterSpacing: -0.5 }}>
            How was the ride?
          </Type>
          <Type w={500} size={13} color={colors.muted} style={{ marginTop: 4 }}>
            {P.rateSubNice}
          </Type>
        </View>

        {/* stars */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Tap
              key={n}
              haptic="selection"
              onPress={() => {
                selection();
                setStars(n);
              }}
              scaleTo={0.82}
              hitSlop={8}
              accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`}
              accessibilityState={{ selected: n <= stars }}
              style={{ padding: 4 }}
            >
              <Icon
                name={n <= stars ? 'star' : 'star-outline'}
                size={38}
                color={n <= stars ? colors.star : colors.starOff}
              />
            </Tap>
          ))}
        </View>

        {/* tags */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 9,
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          {TAG_DEFS.map(([key, label]) => {
            const on = !!tags[key];
            return (
              <Tap
                key={key}
                haptic="selection"
                onPress={() => toggleTag(key)}
                accessibilityLabel={label}
                accessibilityState={{ selected: on }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 999,
                  backgroundColor: on ? colors.primary : colors.card,
                  borderWidth: 1.5,
                  borderColor: on ? colors.primary : colors.border,
                }}
              >
                {on ? <Icon name="checkmark" size={14} color={colors.white} /> : null}
                <Type w={600} size={13} color={on ? colors.white : colors.muted}>
                  {label}
                </Type>
              </Tap>
            );
          })}
        </View>

        {/* swap contacts */}
        <View
          style={[
            {
              marginTop: 28,
              borderWidth: 1,
              borderColor: colors.amberBorder,
              borderRadius: 20,
              backgroundColor: colors.amberTint,
              padding: 18,
            },
            shadow(1),
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="people" size={17} color={colors.amberInk} />
            <Type w={700} size={13} color={colors.amberInk}>
              Nice chat? Swap contacts
            </Type>
          </View>
          <Type w={500} size={11} color={colors.amberMute} style={{ marginTop: 6 }}>
            Shared only if you both tap.
          </Type>
          <View style={{ gap: 9, marginTop: 14 }}>
            {P.swap.map((w, i) => {
              const on = !!swapped[w.k];
              return (
                <Appear key={w.k} index={i}>
                  <Tap
                    haptic="light"
                    onPress={() => {
                      if (!on) success();
                      toggleSwapped(w.k);
                    }}
                    accessibilityLabel={`Swap contact with ${w.name}`}
                    accessibilityState={{ selected: on }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 11,
                      paddingVertical: 11,
                      paddingHorizontal: 12,
                      borderRadius: 14,
                      backgroundColor: colors.card,
                      borderWidth: 1.5,
                      borderColor: on ? colors.amber : colors.hair,
                    }}
                  >
                    <Avatar initial={w.init} bg={w.avBg} size={34} />
                    <Type w={700} size={13} color={colors.ink} style={{ flex: 1 }}>
                      {w.name}
                    </Type>
                    {on ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Icon name="checkmark-circle" size={16} color={colors.amber} />
                        <Type w={700} size={12} color={colors.amberInk}>
                          Sent
                        </Type>
                      </View>
                    ) : (
                      <Type w={600} size={12} color={colors.faint}>
                        Tap to share
                      </Type>
                    )}
                  </Tap>
                </Appear>
              );
            })}
          </View>
        </View>

        <View style={{ flex: 1 }} />
        <PrimaryButton
          label="Done"
          icon="checkmark"
          accessibilityHint="Save your rating and go to your profile"
          onPress={() => {
            success();
            navigate(SCREENS.YOU);
          }}
        />
      </View>
    </Screen>
  );
}
