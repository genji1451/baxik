/**
 * Инициализация Telegram Mini App и настройка
 */

// Проверка наличия Telegram WebApp API и его инициализация
export function initializeTelegramWebApp() {
  if (typeof window === 'undefined') return null;
  
  const tg = (window as any).Telegram?.WebApp;
  if (!tg) return null;

  try {
    // Сообщаем Telegram что приложение готово к работе 
    tg.ready();
    
    // Расширяем приложение на всю высоту
    if (typeof tg.expand === 'function') {
      tg.expand();
    }
    
    // Настраиваем тему
    if (tg.colorScheme) {
      document.documentElement.setAttribute('data-theme', tg.colorScheme);
    }
    
    // Настраиваем MainButton если она доступна
    if (tg.MainButton) {
      tg.MainButton.setParams({
        text: 'Продолжить',
        color: '#31b545'
      });
    }
    
    console.log('Telegram WebApp успешно инициализирован');
    return tg;
  } catch (error) {
    console.error('Ошибка при инициализации Telegram WebApp:', error);
    return null;
  }
}

// Получение параметров запуска из Telegram
export function getTelegramInitData() {
  if (typeof window === 'undefined') return null;
  
  const tg = (window as any).Telegram?.WebApp;
  if (!tg) return null;
  
  return {
    initData: tg.initData,
    initDataUnsafe: tg.initDataUnsafe,
    startParam: tg.startParam
  };
}
