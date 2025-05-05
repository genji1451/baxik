import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { useAdService } from './AdService';

/**
 * Компонент кнопки для тестирования показа рекламы.
 * Включает индикацию загрузки и статуса выполнения запроса.
 */
export function TestAdButton() {
  const { showAd } = useAdService();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleShowAd = async () => {
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
          status === 'error' && styles.buttonError
        ]} 
        onPress={handleShowAd}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.text}>
            {status === 'idle' && 'Показать тестовую рекламу'}
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
}); 