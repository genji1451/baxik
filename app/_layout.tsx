import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { colors } from "@/constants/colors";
import { useTelegramFullscreen } from "@/components/useTelegramFullscreen";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTelegramInsets } from "@/components/useTelegramInsets";
import { useTelegramUser } from "@/components/useTelegramUser";
import { adManager } from "@/utils/adManager";
import { AdServiceProvider } from "@/components/AdService";

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
  
  // Получаем пользователя для показа рекламы
  const user = useTelegramUser();

  // Эффект для проверки доступа к данным пользователя
  useEffect(() => {
    // Проверяем только в браузере
    if (typeof window !== 'undefined') {
      const tg = (window as any).Telegram?.WebApp;
      
      // Если API Telegram доступен, но нет данных пользователя
      if (tg && (!tg.initDataUnsafe || !tg.initDataUnsafe.user)) {
        console.warn("Нет доступа к данным пользователя Telegram");
        
        // Только в веб-версии показываем предупреждение
        if (Platform.OS === 'web') {
          // Отложенное предупреждение для улучшения UX
          const timer = setTimeout(() => {
            // Альтернатива Alert для веб
            if (typeof window.alert === 'function') {
              window.alert(
                "Для полноценной работы приложения требуется доступ к данным пользователя. " +
                "Убедитесь, что приложение открыто через Telegram и имеет необходимые разрешения."
              );
            }
          }, 2000);
          
          return () => clearTimeout(timer);
        }
      }
    }
  }, []);

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
    <AdServiceProvider showAdOnMount={user !== null}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <RootLayoutNav />
        </ErrorBoundary>
      </SafeAreaProvider>
    </AdServiceProvider>
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