import { showGramAds } from './gramAds';

// Интервал между показами рекламы (мс)
const MIN_AD_INTERVAL = 5 * 60 * 1000; // 5 минут

// Класс для управления показом рекламы
class AdManager {
  constructor() {
    this.lastAdShownTime = 0;
  }

  // Показать рекламу с учетом интервала
  async showAdIfEligible(chatId) {
    const currentTime = Date.now();
    
    // Проверяем, прошло ли достаточно времени с последнего показа
    if (currentTime - this.lastAdShownTime < MIN_AD_INTERVAL) {
      console.log('Ad skipped: too soon since last ad');
      return false;
    }
    
    // Показываем рекламу
    const success = await showGramAds(chatId);
    
    if (success) {
      this.lastAdShownTime = currentTime;
    }
    
    return success;
  }
  
  // Показать рекламу после завершения какого-либо действия
  async showAdAfterAction(chatId, actionName) {
    console.log(`Action completed: ${actionName}. Showing ad...`);
    return this.showAdIfEligible(chatId);
  }
  
  // Сбросить таймер (например, если пользователь сделал что-то важное)
  resetTimer() {
    this.lastAdShownTime = 0;
  }
}

// Создаем и экспортируем синглтон
export const adManager = new AdManager(); 