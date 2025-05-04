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
  
  // Уменьшаем размер нижнего отступа, чтобы не перекрывать меню
  // Используем только базовый отступ без дополнительного увеличения
  const bottomInset = Math.max(insets.bottom, tgInsets.bottom);
  
  return (
    <View style={{ flex: 1 }}>
      {/* Верхний отступ черного цвета */}
      <View style={{ 
        height: topInset, 
        backgroundColor: colors.background, // Черный фон
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }} />
      
      {/* Основной контент */}
      <View style={{ 
        flex: 1, 
        marginTop: topInset,
        // Нижний отступ для контента - оставляем место для меню + базовый отступ
        paddingBottom: bottomInset + 60 // 60px для меню + базовый отступ
      }}>
        <Stack
          screenOptions={{
            // Дополнительный отступ для заголовка
            headerStyle: {
              backgroundColor: colors.background,
              height: 60, // Увеличиваем высоту заголовка
            },
            // Центрирование заголовка
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18, // Увеличиваем размер шрифта
            },
            // Дополнительные стили контента
            contentStyle: {
              backgroundColor: colors.background,
              paddingTop: 10, // Дополнительный отступ для контента
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
      
      {/* Нижний отступ - только для нижней границы экрана, не перекрывающий меню */}
      <View style={{ 
        height: bottomInset, 
        backgroundColor: '#1E1E1E', // Цвет как вы указали
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // zIndex меньше, чем у меню, чтобы не перекрывать его
        zIndex: 1
      }} />
    </View>
  );
}