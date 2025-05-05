import { useEffect, useState } from 'react';

// Интерфейс для пользователя Telegram
interface TelegramUser {
  id: string | number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  [key: string]: any; // Для других полей, которые может возвращать Telegram
}

export function useTelegramUser(): TelegramUser | null {
  const [user, setUser] = useState<TelegramUser | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = (window as any).Telegram?.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setUser(tg.initDataUnsafe.user);
      }
    }
  }, []);
  
  return user;
} 