import React, { useEffect, useRef, useState } from 'react';
import { View, Animated } from 'react-native';
import Type from '../components/Type';
import Logo from '../components/Logo';
import { colors } from '../theme';
import { useApp, SCREENS } from '../context/AppContext';

const LINES = ['Verifying @aui.ma…', 'Loading your habits…', 'Ready'];

export default function SplashScreen() {
  const { replace } = useApp();
  const [step, setStep] = useState(0);
  const barW = useRef(new Animated.Value(0.12)).current;
  const logo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(logo, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 8 }).start();
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 1100),
      setTimeout(() => replace(SCREENS.ROLE), 1800),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const to = step === 0 ? 0.12 : step === 1 ? 0.58 : 1;
    Animated.timing(barW, { toValue: to, duration: 500, useNativeDriver: false }).start();
  }, [step, barW]);

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
    >
      <Animated.View
        style={{
          alignItems: 'center',
          transform: [
            { scale: logo.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
          ],
          opacity: logo,
        }}
      >
        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: 26,
            backgroundColor: 'rgba(255,255,255,0.16)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Logo tile={false} size={54} color={colors.white} tileColor={colors.primary} />
        </View>
        <Type w={800} size={38} color={colors.white} style={{ letterSpacing: -1 }}>
          Cambus
        </Type>
        <Type w={500} size={13} color="rgba(255,255,255,0.85)" style={{ marginTop: 6, letterSpacing: 0.4 }}>
          Share the ride, AUI
        </Type>
      </Animated.View>

      <View
        style={{
          width: 150,
          height: 5,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.25)',
          marginTop: 44,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height: 5,
            borderRadius: 3,
            backgroundColor: colors.white,
            width: barW.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }}
        />
      </View>
      <Type w={500} size={11} color="rgba(255,255,255,0.85)" style={{ marginTop: 14 }}>
        {LINES[step]}
      </Type>
    </View>
  );
}
