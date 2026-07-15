import React from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import Screen from '../components/Screen';
import Type from '../components/Type';
import Icon from '../components/Icon';
import Tap from '../components/Tap';
import Appear from '../components/Appear';
import { BackChevron, PrimaryButton } from '../components/UI';
import { colors, shadow } from '../theme';
import { selection } from '../lib/haptics';
import { useApp, SCREENS } from '../context/AppContext';
import { prefDefs } from '../data/personas';

function PrefTile({ icon, label, on, onPress, index }) {
  return (
    <Appear index={index} style={{ width: '48%' }}>
      <Tap
        onPress={onPress}
        haptic="selection"
        accessibilityLabel={label}
        accessibilityState={{ selected: on }}
        style={[
          {
            padding: 16,
            borderRadius: 18,
            gap: 12,
            backgroundColor: on ? colors.primaryTint : colors.card,
            borderWidth: 1.5,
            borderColor: on ? colors.primary : colors.border,
          },
          on ? null : shadow(1),
        ]}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: on ? colors.primary : colors.surface,
          }}
        >
          <Icon name={icon} size={20} color={on ? colors.white : colors.muted} />
        </View>
        <Type w={700} size={13.5} color={colors.ink}>
          {label}
        </Type>
      </Tap>
    </Appear>
  );
}

function LabeledSlider({ leftIcon, left, rightIcon, right, value, onChange }) {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name={leftIcon} size={15} color={colors.muted} />
          <Type w={600} size={13} color={colors.slate}>
            {left}
          </Type>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Type w={600} size={13} color={colors.slate}>
            {right}
          </Type>
          <Icon name={rightIcon} size={15} color={colors.muted} />
        </View>
      </View>
      <Slider
        minimumValue={0}
        maximumValue={100}
        value={value}
        onValueChange={onChange}
        onSlidingComplete={() => selection()}
        step={1}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.hair}
        thumbTintColor={colors.primary}
      />
    </View>
  );
}

export default function RideStyleScreen() {
  const { prefs, togglePref, chatty, setChatty, plan, setPlan, navigate, goBack } = useApp();

  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 8 }}>
          <BackChevron onPress={goBack} />
        </View>
        <Type w={800} size={26} color={colors.ink} style={{ letterSpacing: -0.6, marginTop: 14 }}>
          Your ride style
        </Type>
        <Type w={500} size={13.5} color={colors.muted} style={{ marginTop: 6 }}>
          We'll match you with drivers who fit.
        </Type>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 12,
            marginTop: 22,
          }}
        >
          {prefDefs.map(([key, label, icon], i) => (
            <PrefTile
              key={key}
              index={i}
              icon={icon}
              label={label}
              on={!!prefs[key]}
              onPress={() => togglePref(key)}
            />
          ))}
        </View>

        <View style={{ gap: 28, marginTop: 34 }}>
          <LabeledSlider
            leftIcon="volume-mute"
            left="Quiet"
            rightIcon="chatbubbles"
            right="Chatty"
            value={chatty}
            onChange={setChatty}
          />
          <LabeledSlider
            leftIcon="calendar"
            left="Planner"
            rightIcon="flash"
            right="Spontaneous"
            value={plan}
            onChange={setPlan}
          />
        </View>

        <View style={{ flex: 1 }} />
        <PrimaryButton
          label="Find my car"
          accessibilityHint="Browse cars matched to your style"
          onPress={() => navigate(SCREENS.HOME)}
        />
      </View>
    </Screen>
  );
}
