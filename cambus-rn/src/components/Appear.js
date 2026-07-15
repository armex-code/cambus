import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useReducedMotion, motion } from '../lib/motion';

// Fade + subtle rise entrance for a single element. Use `index` to stagger a
// list (30-50ms per item, MD). Fully skipped when Reduce Motion is on.
export default function Appear({ children, index = 0, distance = 8, style }) {
  const reduced = useReducedMotion();
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) {
      t.setValue(1);
      return;
    }
    t.setValue(0);
    Animated.timing(t, {
      toValue: 1,
      duration: motion.enter,
      delay: index * motion.stagger,
      useNativeDriver: true,
    }).start();
  }, [reduced, index, t]);

  return (
    <Animated.View
      style={[
        {
          opacity: t,
          transform: [
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) },
          ],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
