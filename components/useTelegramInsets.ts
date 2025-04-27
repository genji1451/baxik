import { useEffect, useState } from "react";

export function useTelegramInsets() {
  const [bottom, setBottom] = useState(0);
  
  useEffect(() => {
    // Check if code is running in browser and Telegram WebApp is available
    if (typeof window !== 'undefined') {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        // Initial calculation
        calculateInsets();
        
        // Recalculate on resize or when expanded state changes
        window.addEventListener('resize', calculateInsets);
        tg.onEvent && tg.onEvent('viewportChanged', calculateInsets);
        
        // Function to calculate insets based on Telegram WebApp viewport
        function calculateInsets() {
          if (tg.viewportStableHeight) {
            // Calculate the difference between window height and telegram viewportStableHeight
            // This gives us the space occupied by Telegram elements
            const diff = window.innerHeight - tg.viewportStableHeight;
            setBottom(diff > 0 ? diff : 0);
          }
        }
        
        // Cleanup event listeners
        return () => {
          window.removeEventListener('resize', calculateInsets);
          tg.offEvent && tg.offEvent('viewportChanged', calculateInsets);
        };
      }
    }
  }, []);
  
  return { bottom };
} 