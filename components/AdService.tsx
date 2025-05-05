import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTelegramUser } from './useTelegramUser';
import { adManager } from '../utils/adManager';

// Создаем контекст для рекламного сервиса
interface AdServiceContextType {
  showAd: () => Promise<boolean>;
  showAdAfterAction: (actionName: string) => Promise<boolean>;
}

const AdServiceContext = createContext<AdServiceContextType | null>(null);

// Хук для использования AdService
export const useAdService = (): AdServiceContextType => {
  const context = useContext(AdServiceContext);
  if (!context) {
    throw new Error('useAdService must be used within an AdServiceProvider');
  }
  return context;
};

// Провайдер для AdService
interface AdServiceProviderProps {
  children: ReactNode;
  showAdOnMount?: boolean;
}

export const AdServiceProvider: React.FC<AdServiceProviderProps> = ({ 
  children, 
  showAdOnMount = false 
}) => {
  const user = useTelegramUser();
  
  // Показать рекламу при монтировании компонента
  useEffect(() => {
    if (showAdOnMount && user) {
      const timer = setTimeout(() => {
        const userId = typeof user === 'object' && user ? 
          (user as any).id || String(user) : 
          String(user);
          
        adManager.showAdIfEligible(userId);
      }, 2000); // Задержка для загрузки приложения
      
      return () => clearTimeout(timer);
    }
  }, [user, showAdOnMount]);
  
  // Методы для показа рекламы
  const showAd = async (): Promise<boolean> => {
    if (!user) return false;
    
    const userId = typeof user === 'object' && user ? 
      (user as any).id || String(user) : 
      String(user);
      
    return adManager.showAdIfEligible(userId);
  };
  
  const showAdAfterAction = async (actionName: string): Promise<boolean> => {
    if (!user) return false;
    
    const userId = typeof user === 'object' && user ? 
      (user as any).id || String(user) : 
      String(user);
      
    return adManager.showAdAfterAction(userId, actionName);
  };
  
  return (
    <AdServiceContext.Provider value={{ showAd, showAdAfterAction }}>
      {children}
    </AdServiceContext.Provider>
  );
}; 