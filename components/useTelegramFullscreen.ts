import { useEffect } from "react";

export function useTelegramFullscreen() {
  useEffect(() => {
    // Wait for the DOM to be fully loaded and ready
    if (typeof window === 'undefined') return;

    // Check if Telegram WebApp API is available
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) {
      console.warn("Telegram WebApp API is not available.");
      return;
    }

    // Initialize the WebApp
    if (typeof tg.expand === 'function') {
      // First expand the WebApp to its maximum allowed height
      tg.expand();
    }

    // Then request fullscreen if it's supported and not already in fullscreen
    if (!tg.isFullscreen && typeof tg.requestFullscreen === 'function') {
      // Small delay to ensure expand has completed
      setTimeout(() => {
        try {
          tg.requestFullscreen();
        } catch (e) {
          console.warn("Failed to request fullscreen:", e);
        }
      }, 100);
    }

    // Listen for fullscreen changes to maintain fullscreen
    const onFullscreenChanged = () => {
      if (!tg.isFullscreen && typeof tg.requestFullscreen === 'function') {
        try {
          tg.requestFullscreen();
        } catch (e) {
          console.warn("Failed to re-request fullscreen:", e);
        }
      }
    };

    // Listen for viewport changes to adjust UI if needed
    const onViewportChanged = () => {
      // You can handle additional viewport change logic here if needed
    };

    // Add event listeners
    tg.onEvent && tg.onEvent('fullscreenChanged', onFullscreenChanged);
    tg.onEvent && tg.onEvent('viewportChanged', onViewportChanged);

    // Cleanup event listeners
    return () => {
      tg.offEvent && tg.offEvent('fullscreenChanged', onFullscreenChanged);
      tg.offEvent && tg.offEvent('viewportChanged', onViewportChanged);
    };
  }, []);
} 