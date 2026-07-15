import React, { useEffect, useRef } from 'react';
import { Animated, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { useReducedMotion, motion } from '../lib/motion';

// Wraps every screen: a fade+rise entrance (the web `screenIn` keyframe)
// and consistent 28px padding with safe-area awareness.
export default function Screen({ children, scroll = false, padding = 28, style, contentStyle }) {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) {
      anim.setValue(1);
      return;
    }
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: motion.enter,
      useNativeDriver: true,
    }).start();
  }, [anim, reduced]);

  const animStyle = {
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }),
      },
    ],
  };

  const pad = {
    paddingHorizontal: padding,
    paddingTop: insets.top + 8,
    paddingBottom: insets.bottom + 16,
  };

  if (scroll) {
    return (
      <Animated.View style={[{ flex: 1, backgroundColor: colors.bg }, animStyle, style]}>
        <ScrollView
          contentContainerStyle={[pad, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: colors.bg }, animStyle, style]}>
      <View style={[{ flex: 1 }, pad, contentStyle]}>{children}</View>
    </Animated.View>
  );
}
