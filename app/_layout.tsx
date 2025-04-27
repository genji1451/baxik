import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { colors } from "@/constants/colors";
import { useTelegramFullscreen } from "@/components/useTelegramFullscreen";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useTelegramFullscreen();

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'default',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="transaction/new" 
        options={{ 
          presentation: 'modal',
          title: 'Новая транзакция',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="transaction/[id]" 
        options={{ 
          presentation: 'card',
          title: 'Детали транзакции',
          headerShown: true,
        }} 
      />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

// Rename the local function to avoid conflict
function useTelegramFullscreenLocal() {
  useEffect(() => {
    // Check if Telegram WebApp API is available
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) {
      console.warn("Telegram WebApp API is not available.");
      return;
    }

    // Request fullscreen if not already in fullscreen
    if (!tg.isFullscreen && typeof tg.requestFullscreen === 'function') {
      tg.requestFullscreen();
    }

    // Optional: Listen for fullscreen changes
    const onFullscreenChanged = () => {
      if (!tg.isFullscreen && typeof tg.requestFullscreen === 'function') {
        tg.requestFullscreen();
      }
    };

    tg.onEvent && tg.onEvent('fullscreenChanged', onFullscreenChanged);

    // Cleanup
    return () => {
      tg.offEvent && tg.offEvent('fullscreenChanged', onFullscreenChanged);
    };
  }, []);
}