import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Thin, crash-safe wrapper. Haptics are a no-op on web and must never throw.
const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

export function tapLight() {
  if (!enabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function tapMedium() {
  if (!enabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export function selection() {
  if (!enabled) return;
  Haptics.selectionAsync().catch(() => {});
}

export function success() {
  if (!enabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
