import { useEffect, useCallback, useState } from 'react';
import {
  miniApp as miniAppFeature,
  themeParams as themeParamsFeature,
  viewport as viewportFeature,
  useSignal
} from '@tma.js/sdk-react';
import { useCartStore } from '../store/cartStore.js';
import { useUIStore } from '../store/uiStore.js';
import { useHaptic } from './useHaptic.js';

export const useTMALogic = () => {
  const miniApp = miniAppFeature;
  const { isCartOpen, setCartOpen, cart } = useCartStore();
  const {
    viewerOpen, setViewer,
    selectedProduct, setSelectedProduct,
    isContactOpen, setIsContactOpen,
    showConfirmation, setShowConfirmation
  } = useUIStore();
  const { light } = useHaptic();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [homeScreenStatus, setHomeScreenStatus] = useState('unknown');

  // Signals
  const themeParams = useSignal(themeParamsFeature.state);
  const viewport = useSignal(viewportFeature.state);

  // Update CSS Variables for Theme
  useEffect(() => {
    if (!themeParams) return;
    const root = document.documentElement;
    const themeEntries = [
      ['--tg-theme-bg-color', themeParams.backgroundColor],
      ['--tg-theme-text-color', themeParams.textColor],
      ['--tg-theme-hint-color', themeParams.hintColor],
      ['--tg-theme-link-color', themeParams.linkColor],
      ['--tg-theme-button-color', themeParams.buttonColor],
      ['--tg-theme-button-text-color', themeParams.buttonTextColor],
      ['--tg-theme-secondary-bg-color', themeParams.secondaryBackgroundColor],
    ];
    themeEntries.forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(key, value);
      }
    });
  }, [themeParams]);

  // Update CSS Variables for Viewport
  useEffect(() => {
    if (!viewport) return;
    const root = document.documentElement;
    if (viewport.height) {
      root.style.setProperty('--tg-viewport-height', `${viewport.height}px`);
    }
    if (viewport.stableHeight) {
      root.style.setProperty('--tg-viewport-stable-height', `${viewport.stableHeight}px`);
    }
  }, [viewport]);

  // Initialize TMA
  useEffect(() => {
    if (!miniApp) return;

    try {
      miniApp.ready?.();
      miniApp.expand?.();
      miniApp.requestFullscreen?.();
      miniApp.lockOrientation?.('portrait');
    } catch (error) {
      console.warn('TMA initialization warning:', error);
    }

    // Safe Area
    const safeAreaHandler = () => {
      const root = document.documentElement;
      const safeArea = miniApp.safeAreaInset;
      if (!safeArea) return;
      root.style.setProperty('--tg-safe-area-top', `${safeArea.top ?? 0}px`);
      root.style.setProperty('--tg-safe-area-bottom', `${safeArea.bottom ?? 0}px`);
      root.style.setProperty('--tg-safe-area-left', `${safeArea.left ?? 0}px`);
      root.style.setProperty('--tg-safe-area-right', `${safeArea.right ?? 0}px`);
    };

    miniApp.onEvent?.('safeAreaChanged', safeAreaHandler);
    safeAreaHandler();

    try {
      const onFullscreen = () => setIsFullscreen(Boolean(miniApp.isFullscreen));
      const onHomeScreenAdded = () => setHomeScreenStatus('added');

      miniApp.onEvent?.('fullscreenChanged', onFullscreen);
      miniApp.onEvent?.('homeScreenAdded', onHomeScreenAdded);

      miniApp.checkHomeScreenStatus?.((status) => {
        if (status) setHomeScreenStatus(status);
      });

      return () => {
        miniApp.offEvent?.('fullscreenChanged', onFullscreen);
        miniApp.offEvent?.('homeScreenAdded', onHomeScreenAdded);
        miniApp.offEvent?.('safeAreaChanged', safeAreaHandler);
      };
    } catch (error) {
      console.warn('TMA event registration warning:', error);
    }
  }, [miniApp]);

  // Main Button
  useEffect(() => {
    if (!miniApp?.MainButton) return;

    const handleMainButtonClick = () => {
      light();
      setCartOpen(!isCartOpen);
    };

    miniApp.MainButton.onClick(handleMainButtonClick);

    if (cart.length === 0) {
      miniApp.MainButton.hide();
    } else {
      miniApp.MainButton.setText(isCartOpen ? 'Fermer le panier' : 'Voir le panier');
      miniApp.MainButton.show();
      miniApp.MainButton.enable();
    }

    return () => {
      miniApp.MainButton?.offClick?.(handleMainButtonClick);
    };
  }, [miniApp, isCartOpen, cart.length, light, setCartOpen]);

  // Back Button
  useEffect(() => {
    if (!miniApp?.BackButton) return;

    const handleBack = () => {
      light();
      if (viewerOpen) {
        setViewer(false, null, 0);
        return;
      }
      if (selectedProduct) {
        setSelectedProduct(null);
        return;
      }
      if (isContactOpen) {
        setIsContactOpen(false);
        return;
      }
      if (showConfirmation) {
        setShowConfirmation(false);
        return;
      }
      if (isCartOpen) {
        setCartOpen(false);
      }
    };

    miniApp.BackButton.onClick(handleBack);

    const shouldShow = Boolean(viewerOpen || selectedProduct || isContactOpen || showConfirmation || isCartOpen);
    if (shouldShow) {
      miniApp.BackButton.show();
    } else {
      miniApp.BackButton.hide();
    }

    return () => {
      miniApp.BackButton?.offClick?.(handleBack);
    };
  }, [miniApp, viewerOpen, selectedProduct, isContactOpen, showConfirmation, isCartOpen, light, setViewer, setSelectedProduct, setIsContactOpen, setShowConfirmation, setCartOpen]);

  const handleAddToHomeScreen = useCallback(() => {
    if (!miniApp?.addToHomeScreen) return;
    light();
    miniApp.addToHomeScreen();
  }, [miniApp, light]);

  return {
    isFullscreen,
    homeScreenStatus,
    handleAddToHomeScreen,
    miniApp,
  };
};
