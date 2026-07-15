import React, { useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { AppProvider, useApp, SCREENS } from './src/context/AppContext';
import { colors } from './src/theme';

import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import RideStyleScreen from './src/screens/RideStyleScreen';
import HomeScreen from './src/screens/HomeScreen';
import RideScreen from './src/screens/RideScreen';
import RateScreen from './src/screens/RateScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import DriverScreen from './src/screens/DriverScreen';

const REGISTRY = {
  [SCREENS.SPLASH]: SplashScreen,
  [SCREENS.ROLE]: WelcomeScreen,
  [SCREENS.STYLE]: RideStyleScreen,
  [SCREENS.HOME]: HomeScreen,
  [SCREENS.RIDE]: RideScreen,
  [SCREENS.RATE]: RateScreen,
  [SCREENS.YOU]: ProfileScreen,
  [SCREENS.NOTIFS]: AlertsScreen,
  [SCREENS.DRIVER]: DriverScreen,
};

function Router() {
  const { screen, canGoBack, goBack } = useApp();

  // Android hardware back → step back through our screen history.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack) {
        goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack, goBack]);

  const ActiveScreen = REGISTRY[screen] || WelcomeScreen;
  const dark = screen === SCREENS.SPLASH;

  return (
    <View style={{ flex: 1, backgroundColor: dark ? colors.primary : colors.bg }}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <ActiveScreen />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    // brief brand-blue hold matching the splash while the font loads
    return <View style={{ flex: 1, backgroundColor: colors.primary }} />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider initialPersona="salma">
        <Router />
      </AppProvider>
    </SafeAreaProvider>
  );
}
