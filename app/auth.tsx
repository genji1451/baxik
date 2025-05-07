import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, router } from 'expo-router';
import { generateBotLink } from '@/utils/generateTgLink';

export default function AuthScreen() {
  useEffect(() => {
    // Если приложение открывается напрямую, не из Telegram,
    // можно перенаправить пользователя на специальную глубокую ссылку
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const startParam = urlParams.get('startapp');
      
      if (startParam) {
        // Запоминаем параметр, чтобы использовать его после авторизации
        localStorage.setItem('telegram_start_param', startParam);
      }
    }
  }, []);
  
  const openInTelegram = () => {
    if (typeof window !== 'undefined') {
      const startParam = localStorage.getItem('telegram_start_param') || 'default';
      const botName = 'YOUR_BOT_NAME'; // Замените на имя вашего бота
      
      // Создаем специальную глубокую ссылку для открытия Mini App
      const telegramLink = `https://t.me/${botName}/app?startapp=${startParam}`;
      
      window.location.href = telegramLink;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Требуется авторизация в Telegram</Text>
        
        <Text style={styles.description}>
          Для использования приложения и показа рекламы необходимо открыть его через Telegram.
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={openInTelegram}>
          <Text style={styles.buttonText}>Открыть в Telegram</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  button: {
    backgroundColor: '#0088CC', // Цвет Telegram
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
