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
  
  const bottomInset = Math.max(insets.bottom, tgInsets.bottom) + 1;
  const topInset = Math.max(insets.top, tgInsets.top);
  
  // Определим цвет для нижнего отступа
  const bottomColor = "#1E1E1E"; // Светло-серый цвет, обычно используется для табов
  
  // Создадим стили напрямую
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    topSpacer: {
      height: topInset,
      backgroundColor: colors.background,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    },
    bottomSpacer: {
      height: bottomInset,
      backgroundColor: bottomColor, // Серый цвет для нижнего меню
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10
    },
    content: {
      flex: 1,
      paddingTop: topInset,
      paddingBottom: bottomInset
    }
  });
  
  // Кастомный рендер для заголовка с принудительным центрированием
  const renderCustomHeader = ({ options, route, navigation }) => {
    return (
      <View style={{
        height: 50,
        backgroundColor: colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
      }}>
        {navigation.canGoBack() && (
          <TouchableOpacity 
            style={{ position: 'absolute', left: 10 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: colors.text }}>Назад</Text>
          </TouchableOpacity>
        )}
        
        <Text style={{ 
          color: colors.text, 
          fontSize: 18, 
          fontWeight: 'bold',
          textAlign: 'center' 
        }}>
          {options.title || route.name}
        </Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Верхний отступ черного цвета */}
      <View style={styles.topSpacer} />
      
      {/* Основной контент */}
      <View style={styles.content}>
        <Stack
          screenOptions={{
            header: renderCustomHeader, // Используем кастомный заголовок
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
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
      
      {/* Нижний отступ серого цвета - сделаем его визуально видимым */}
      <View style={styles.bottomSpacer} />
    </View>
  );
}