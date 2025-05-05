import { useEffect, useState } from 'react';

// Интерфейс для пользователя Telegram
interface TelegramUser {
  id: string | number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  [key: string]: any; // Для других полей, которые может возвращать Telegram
}

/**
 * Хук для получения данных пользователя из Telegram WebApp API
 * 
 * Для работы хука необходимо:
 * 1. Мини-приложение должно быть открыто через Telegram
 * 2. Пользователь должен быть авторизован в Telegram
 * 3. В BotFather должны быть настроены разрешения на доступ к данным пользователя
 */
export function useTelegramUser(): TelegramUser | null {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);
  
  useEffect(() => {
    // Функция для инициализации и получения данных пользователя
    const initTelegramUser = () => {
      if (typeof window === 'undefined') return;
      
      try {
        const tg = (window as any).Telegram?.WebApp;
        if (!tg) {
          console.warn('Telegram WebApp API не доступен. Убедитесь, что приложение запущено в Telegram.');
          return;
        }
        
        // Проверяем, доступны ли данные пользователя
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
          const userData = tg.initDataUnsafe.user;
          console.log('Данные пользователя получены:', userData.id);
          setUser(userData);
        } else {
          console.warn('Данные пользователя не доступны. Проверьте настройки бота в BotFather.');
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      } finally {
        setInitAttempted(true);
      }
    };
    
    // Вызываем инициализацию только если еще не пытались это сделать
    if (!initAttempted) {
      initTelegramUser();
    }
  }, [initAttempted]);
  
  return user;
} 