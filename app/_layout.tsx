import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { colors } from "@/constants/colors";
import { useTelegramFullscreen } from "@/components/useTelegramFullscreen";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTelegramInsets } from "@/components/useTelegramInsets";

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
    <SafeAreaProvider>
      <ErrorBoundary>
        <RootLayoutNav />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const insets = useSafeAreaInsets();
  const tgInsets = useTelegramInsets();
  
  // Use the maximum value between SafeArea insets and Telegram insets
  // Add fixed 30px padding for web version
  const bottomInset = Math.max(insets.bottom, tgInsets.bottom) + 30;
  
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: bottomInset }}>
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
    </View>
  );
}