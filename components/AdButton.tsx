import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  StyleSheet, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useAdService } from './AdService';
import { useRouter } from 'expo-router';
import { hasUserData, isTelegramWebApp } from '@/utils/generateTgLink';

interface AdButtonProps {
  style?: any;
  textStyle?: any;
  title?: string;
  testChatId?: string;
  checkTelegramAccess?: boolean;
}

export function AdButton({ 
  style, 
  textStyle, 
  title = 'Показать рекламу',
  testChatId,
  checkTelegramAccess = true
}: AdButtonProps) {
  const { showAd } = useAdService();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const isInTelegram = isTelegramWebApp();
  const hasAccess = hasUserData();
  
  const handleShowAd = async () => {
    // Если включена проверка Telegram и нет доступа, предлагаем перейти на инфо страницу
    if (checkTelegramAccess && (!isInTelegram || !hasAccess)) {
      // На web платформе показываем alert
      if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
        const confirmed = window.confirm(
          'Для показа рекламы необходим доступ к данным пользователя Telegram. ' +
          'Хотите перейти на страницу с инструкцией?'
        );
        if (confirmed) {
          router.push('/telegram-info' as any);
        }
        return;
      }
      
      // На нативных платформах используем Alert
      Alert.alert(
        'Нет доступа к данным',
        'Для показа рекламы необходим доступ к данным пользователя Telegram. Перейти на страницу с инструкцией?',
        [
          { text: 'Отмена', style: 'cancel' },
          { 
            text: 'Перейти', 
            onPress: () => router.push('/telegram-info' as any)
          }
        ]
      );
      return;
    }
    
    try {
      setIsLoading(true);
      setStatus('idle');
      
      const result = await showAd();
      
      setStatus(result ? 'success' : 'error');
      console.log('Ad display result:', result);
    } catch (error) {
      console.error('Error showing ad:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.button,
          isLoading && styles.buttonDisabled,
          status === 'success' && styles.buttonSuccess,
          status === 'error' && styles.buttonError,
          style
        ]} 
        onPress={handleShowAd}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.text, textStyle]}>
            {status === 'idle' && title}
            {status === 'success' && 'Реклама успешно показана! ✅'}
            {status === 'error' && 'Ошибка показа рекламы ❌'}
          </Text>
        )}
      </TouchableOpacity>
      
      {status === 'success' && (
        <Text style={styles.successText}>
          Реклама была успешно показана через API GramADS
        </Text>
      )}
      
      {status === 'error' && (
        <Text style={styles.errorText}>
          Произошла ошибка при показе рекламы. Проверьте консоль.
        </Text>
      )}
      
      {checkTelegramAccess && !isInTelegram && status === 'idle' && (
        <Text style={styles.warningText}>
          Необходимо открыть в Telegram для показа рекламы
        </Text>
      )}
      
      {checkTelegramAccess && isInTelegram && !hasAccess && status === 'idle' && (
        <Text style={styles.warningText}>
          Нет доступа к данным пользователя
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#FF4500', // Яркий оранжево-красный для тестирования
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    minWidth: 220,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#888',
    opacity: 0.7,
  },
  buttonSuccess: {
    backgroundColor: '#4CAF50', // Зеленый для успеха
  },
  buttonError: {
    backgroundColor: '#F44336', // Красный для ошибки
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  successText: {
    color: '#4CAF50',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorText: {
    color: '#F44336',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  warningText: {
    color: '#FF9800',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 12,
  },
}); 