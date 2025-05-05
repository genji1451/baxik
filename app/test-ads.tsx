import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { showGramAds } from '@/utils/gramAds';
import { adManager } from '@/utils/adManager';
import { useAdService } from '@/components/AdService';
import { TestAdButton } from '@/components/TestAdButton';

export default function TestAdsScreen() {
  const { showAd, showAdAfterAction } = useAdService();
  const [customChatId, setCustomChatId] = useState('');
  const [isDirectLoading, setIsDirectLoading] = useState(false);
  const [isManagerLoading, setIsManagerLoading] = useState(false);
  const [result, setResult] = useState<{success?: boolean; message: string}>({
    message: 'Результаты тестирования будут отображены здесь'
  });

  // Тестирование прямого вызова API
  const handleDirectTest = async () => {
    if (!customChatId.trim()) {
      setResult({ 
        success: false, 
        message: 'Ошибка: введите ID чата для тестирования' 
      });
      return;
    }

    try {
      setIsDirectLoading(true);
      setResult({ message: 'Отправка запроса на показ рекламы...' });
      
      const success = await showGramAds(customChatId.trim());
      
      setResult({ 
        success, 
        message: success 
          ? `Успех! Реклама была показана для ID: ${customChatId}` 
          : `Ошибка при показе рекламы для ID: ${customChatId}. Проверьте консоль для деталей.`
      });
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Ошибка: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setIsDirectLoading(false);
    }
  };

  // Тестирование через AdManager
  const handleManagerTest = async () => {
    if (!customChatId.trim()) {
      setResult({ 
        success: false, 
        message: 'Ошибка: введите ID чата для тестирования' 
      });
      return;
    }

    try {
      setIsManagerLoading(true);
      setResult({ message: 'Отправка запроса через AdManager...' });
      
      const success = await adManager.showAdIfEligible(customChatId.trim());
      
      setResult({ 
        success, 
        message: success 
          ? `Успех! Реклама показана через AdManager для ID: ${customChatId}` 
          : `Реклама не показана. Возможно, слишком рано после предыдущего показа. Проверьте консоль.`
      });
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Ошибка: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setIsManagerLoading(false);
    }
  };

  // Сброс таймера AdManager
  const handleResetTimer = () => {
    adManager.resetTimer();
    setResult({ 
      success: true, 
      message: 'Таймер AdManager сброшен. Теперь можно показать рекламу снова.'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Тестирование рекламы',
          headerTitleAlign: 'center',
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.title}>Тестирование рекламы GramADS</Text>
          <Text style={styles.subtitle}>
            Эта страница предназначена для тестирования интеграции с GramADS API
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Тестирование через UI компонент</Text>
          <Text style={styles.description}>
            Использует AdService, который автоматически получает ID пользователя из Telegram WebApp
          </Text>
          
          <View style={styles.buttonContainer}>
            <TestAdButton />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Тестирование с указанием ID</Text>
          <Text style={styles.description}>
            Введите ID пользователя Telegram для прямого тестирования
          </Text>
          
          <TextInput
            style={styles.input}
            value={customChatId}
            onChangeText={setCustomChatId}
            placeholder="Введите ID чата (например, 123456789)"
            placeholderTextColor="#999"
            keyboardType="number-pad"
          />
          
          <View style={styles.buttonsRow}>
            <TouchableOpacity 
              style={[styles.button, styles.directButton, isDirectLoading && styles.disabledButton]} 
              onPress={handleDirectTest}
              disabled={isDirectLoading}
            >
              {isDirectLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Прямой вызов API</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.managerButton, isManagerLoading && styles.disabledButton]} 
              onPress={handleManagerTest}
              disabled={isManagerLoading}
            >
              {isManagerLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Через AdManager</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]} 
            onPress={handleResetTimer}
          >
            <Text style={styles.buttonText}>Сбросить таймер AdManager</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[
          styles.resultContainer, 
          result.success === true ? styles.successResult : 
          result.success === false ? styles.errorResult : 
          styles.pendingResult
        ]}>
          <Text style={styles.resultText}>{result.message}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Примечание: Для работы в Telegram Mini App, пользователь должен быть авторизован, 
            и приложение должно иметь доступ к данным пользователя.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 16,
    fontSize: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  directButton: {
    backgroundColor: '#007AFF',
    flex: 1,
    marginRight: 8,
  },
  managerButton: {
    backgroundColor: '#5856D6',
    flex: 1,
    marginLeft: 8,
  },
  resetButton: {
    backgroundColor: '#FF9500',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  pendingResult: {
    backgroundColor: '#2A2A2A',
  },
  successResult: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    borderWidth: 1,
    borderColor: '#34C759',
  },
  errorResult: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  resultText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 204, 0, 0.2)',
    borderRadius: 8,
    marginBottom: 40,
  },
  infoText: {
    color: '#FFCC00',
    fontSize: 13,
  },
}); 