import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTelegramUser } from './useTelegramUser';
import { showGramAds } from '../utils/gramAds';

interface AdButtonProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  title?: string;
  testChatId?: string; // ID для тестирования
}

export function AdButton({ 
  style, 
  textStyle, 
  title = 'Показать рекламу',
  testChatId 
}: AdButtonProps) {
  const user = useTelegramUser();
  
  const handleShowAd = async () => {
    if (user && (user as any).id) {
      const shown = await showGramAds((user as any).id);
      if (shown) {
        console.log('Ad was shown successfully');
      }
    } else {
      console.warn('Cannot show ad: user information not available');
      
      // Fallback для тестирования - использовать фиксированный chatId
      if (testChatId) {
        await showGramAds(testChatId);
      }
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={handleShowAd}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 