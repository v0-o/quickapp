import { useEffect, useState } from 'react';
import { StorageManager } from '../app/utils/storage.js';
import { useCartStore } from '../store/cartStore.js';
import { useSettingsStore } from '../store/settingsStore.js';

export const useDataLoad = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setCart } = useCartStore();
  const {
    setDeliveryCity,
    setPaymentMethod,
    setAppliedPromo,
    setWishlist,
    setOrderHistory,
    setTheme
  } = useSettingsStore();

  useEffect(() => {
    const loadData = async () => {
      const startTime = Date.now();
      const MIN_LOADING_TIME = 2500; // 2.5 seconds minimum display

      try {
        const [
          savedCart,
          savedCity,
          savedPayment,
          savedPromo,
          savedWishlist,
          savedOrderHistory,
          savedTheme
        ] = await Promise.all([
          StorageManager.loadCart(),
          StorageManager.loadDeliveryCity(),
          StorageManager.loadPaymentMethod(),
          StorageManager.loadPromoCode(),
          StorageManager.loadWishlist(),
          StorageManager.loadOrderHistory(),
          StorageManager.loadTheme(),
        ]);

        // Populate stores
        setCart(savedCart);
        if (savedCity) setDeliveryCity(savedCity);
        if (savedPayment) setPaymentMethod(savedPayment);
        if (savedPromo) setAppliedPromo(savedPromo);
        if (savedWishlist) setWishlist(savedWishlist);
        if (savedOrderHistory) setOrderHistory(savedOrderHistory);
        if (savedTheme) setTheme(savedTheme);

        // Detect low data mode
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlowConnection = connection ? (connection.saveData || (connection.effectiveType || '').toLowerCase().includes('2g')) : false;
        if (isSlowConnection) {
          document.documentElement.classList.add('low-data-mode');
        }
      } catch {
        console.warn('Failed to load some data');
      } finally {
        // Ensure minimum loading time
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    };

    loadData();
  }, [setCart, setDeliveryCity, setPaymentMethod, setAppliedPromo, setWishlist, setOrderHistory, setTheme]);

  return { isLoading };
};
