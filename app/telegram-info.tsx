import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { hasUserData, isTelegramWebApp, generateBotLink, generateWebAppLink } from '@/utils/generateTgLink';

export default function TelegramInfoScreen() {
  // Проверяем, открыто ли приложение в Telegram и есть ли доступ к данным пользователя
  const isInTelegram = isTelegramWebApp();
  const hasAccess = hasUserData();
  
  // Открыть ссылку в браузере
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => {
      console.error('Ошибка при открытии ссылки:', err);
    });
  };
  
  // Открыть приложение в Telegram
  const openInTelegram = () => {
    openLink(generateWebAppLink());
  };
  
  // Открыть бота в Telegram
  const openBot = () => {
    openLink(generateBotLink());
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Информация о Telegram',
          headerTitleAlign: 'center',
        }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Статус подключения Telegram</Text>
          
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Открыто в Telegram:</Text>
              <Text style={[
                styles.statusValue, 
                isInTelegram ? styles.statusSuccess : styles.statusError
              ]}>
                {isInTelegram ? 'Да ✓' : 'Нет ✗'}
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Доступ к данным пользователя:</Text>
              <Text style={[
                styles.statusValue, 
                hasAccess ? styles.statusSuccess : styles.statusError
              ]}>
                {hasAccess ? 'Есть ✓' : 'Нет ✗'}
              </Text>
            </View>
          </View>
          
          {!isInTelegram && (
            <View style={styles.instructionBox}>
              <Text style={styles.instructionTitle}>Приложение не открыто в Telegram</Text>
              <Text style={styles.instructionText}>
                Для полноценной работы приложения, включая показ рекламы, оно должно быть
                открыто через Telegram. Вы можете открыть это приложение в Telegram,
                нажав на кнопку ниже.
              </Text>
              
              <TouchableOpacity 
                style={styles.button} 
                onPress={openInTelegram}
              >
                <Text style={styles.buttonText}>Открыть в Telegram</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {isInTelegram && !hasAccess && (
            <View style={styles.instructionBox}>
              <Text style={styles.instructionTitle}>Нет доступа к данным пользователя</Text>
              <Text style={styles.instructionText}>
                Приложение открыто в Telegram, но у него нет доступа к вашим данным.
                Это может быть связано с настройками бота или с тем, как вы открыли приложение.
              </Text>
              
              <Text style={styles.instructionText}>
                Попробуйте открыть бота в Telegram и запустить приложение оттуда:
              </Text>
              
              <TouchableOpacity 
                style={styles.button} 
                onPress={openBot}
              >
                <Text style={styles.buttonText}>Открыть бота в Telegram</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {isInTelegram && hasAccess && (
            <View style={[styles.instructionBox, styles.successBox]}>
              <Text style={[styles.instructionTitle, styles.successTitle]}>
                Все настроено правильно! ✓
              </Text>
              <Text style={styles.instructionText}>
                Приложение открыто в Telegram и имеет доступ к данным пользователя.
                Все функции, включая показ рекламы, должны работать корректно.
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.card}>
          <Text style={styles.title}>Как правильно открыть Mini App?</Text>
          
          <Text style={styles.paragraph}>
            Для корректной работы Telegram Mini App, включая доступ к данным пользователя
            и возможность показа рекламы, необходимо следовать этим шагам:
          </Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Откройте бота в Telegram</Text>
              <Text style={styles.stepDescription}>
                Найдите и откройте бота в Telegram. Обычно для этого можно использовать 
                поиск в Telegram или перейти по ссылке.
              </Text>
            </View>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Запустите команду или нажмите кнопку</Text>
              <Text style={styles.stepDescription}>
                В чате с ботом запустите команду или нажмите на кнопку, которая откроет 
                Mini App. Только так Telegram передаст данные пользователя в приложение.
              </Text>
            </View>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Разрешите доступ к данным</Text>
              <Text style={styles.stepDescription}>
                При первом запуске Telegram может запросить разрешение на передачу 
                данных пользователя в приложение. Нажмите "Разрешить" для корректной работы.
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, styles.fullButton]} 
            onPress={openBot}
          >
            <Text style={styles.buttonText}>Открыть бота сейчас</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusLabel: {
    fontSize: 16,
    color: '#555',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusSuccess: {
    color: '#4CAF50',
  },
  statusError: {
    color: '#F44336',
  },
  instructionBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  successBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  successTitle: {
    color: '#4CAF50',
  },
  instructionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  fullButton: {
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paragraph: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
}); 