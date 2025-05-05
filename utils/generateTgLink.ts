/**
 * Утилита для генерации ссылок на Telegram бота
 */

// Имя бота 
const BOT_USERNAME = 'baxikbot'; // Замените на имя вашего бота без символа @

/**
 * Генерирует ссылку на бота в Telegram
 * @returns URL для открытия бота
 */
export function generateBotLink(): string {
  return `https://t.me/${BOT_USERNAME}`;
}

/**
 * Генерирует ссылку на Mini App бота в Telegram
 * @param startParam - Опциональный start параметр
 * @returns URL для открытия Mini App
 */
export function generateWebAppLink(startParam?: string): string {
  let url = `https://t.me/${BOT_USERNAME}/app`;
  
  if (startParam) {
    url += `?startapp=${encodeURIComponent(startParam)}`;
  }
  
  return url;
}

/**
 * Определяет, открыто ли приложение внутри Telegram
 * @returns true если приложение открыто в Telegram WebApp
 */
export function isTelegramWebApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  return Boolean((window as any).Telegram?.WebApp);
}

/**
 * Проверяет, есть ли доступ к данным пользователя
 * @returns true если данные пользователя доступны
 */
export function hasUserData(): boolean {
  if (typeof window === 'undefined') return false;
  
  const tg = (window as any).Telegram?.WebApp;
  return Boolean(tg?.initDataUnsafe?.user);
}

/**
 * Получает ID пользователя из Telegram WebApp
 * @returns ID пользователя или null если не доступен
 */
export function getUserId(): string | number | null {
  if (typeof window === 'undefined') return null;
  
  const tg = (window as any).Telegram?.WebApp;
  return tg?.initDataUnsafe?.user?.id || null;
} 