import { useEffect } from "react";

export function useTelegramFullscreen() {
  useEffect(() => {
    // Check if Telegram WebApp API is available
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    // Request fullscreen if not already in fullscreen
    if (!tg.isFullscreen && typeof tg.requestFullscreen === 'function') {
      tg.requestFullscreen();
    }

    // Optional: Listen for fullscreen changes
    const onFullscreenChanged = () => {
      // You can add custom logic here if needed
      // For example, force fullscreen again if exited
      if (!tg.isFullscreen && typeof tg.requestFullscreen === 'function') {
        tg.requestFullscreen();
      }
    };

    tg.onEvent && tg.onEvent('fullscreenChanged', onFullscreenChanged);

    // Cleanup
    return () => {
      tg.offEvent && tg.offEvent('fullscreenChanged', onFullscreenChanged);
    };
  }, []);
} 