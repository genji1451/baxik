import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
  
  const topInset = Math.max(insets.top, tgInsets.top) + 30;
  
  return (
    // Используем Container View с цветом нижнего отступа в качестве фона всего приложения
    <View style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      {/* Верхний отступ */}
      <View style={{ 
        height: topInset, 
        backgroundColor: colors.background 
      }} />
      
      {/* Основной контент с фоном основного цвета приложения */}
      <View style={{ 
        flex: 1, 
        backgroundColor: colors.background
      }}>
        <Stack
          screenOptions={{
            headerTitleAlign: 'center',
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
      
      {/* 
        Нижний отступ нам больше не нужен - вместо него используется 
        backgroundColor контейнера, который виден под нижним меню 
      */}
    </View>
  );
}