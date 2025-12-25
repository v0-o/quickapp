import { useCallback } from 'react';
import { useSettingsStore } from '../store/settingsStore.js';
import { useUIStore } from '../store/uiStore.js';
import { useHaptic } from './useHaptic.js';
import { trackEvent } from '../app/utils/analytics.js';

export const useSettingsLogic = () => {
  const {
    theme,
    setTheme,
    deliveryCity,
    setDeliveryCity,
    paymentMethod,
    setPaymentMethod,
    appliedPromo,
    setAppliedPromo,
  } = useSettingsStore();
  const { showNotification } = useUIStore();
  const { light, success } = useHaptic();

  const handleThemeToggle = useCallback(async () => {
    light();
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    await setTheme(newTheme);
    trackEvent('theme_changed', { theme: newTheme });
  }, [theme, setTheme, light]);

  const handleDeliveryCityChange = useCallback(
    async (city) => {
      light();
      await setDeliveryCity(city);
      trackEvent('delivery_city_changed', { city });
    },
    [setDeliveryCity, light]
  );

  const handlePaymentMethodChange = useCallback(
    async (method) => {
      light();
      await setPaymentMethod(method);
      trackEvent('payment_method_changed', { method });
    },
    [setPaymentMethod, light]
  );

  const handleApplyPromo = useCallback(
    async (code) => {
      light();
      await setAppliedPromo(code);
      success();
      showNotification(`Code ${code} appliqué !`, 'success');
      trackEvent('promo_applied', { code });
    },
    [setAppliedPromo, light, success, showNotification]
  );

  const handleRemovePromo = useCallback(async () => {
    light();
    await setAppliedPromo('');
    showNotification('Code promo retiré', 'info');
  }, [setAppliedPromo, light, showNotification]);

  return {
    theme,
    handleThemeToggle,
    deliveryCity,
    handleDeliveryCityChange,
    paymentMethod,
    handlePaymentMethodChange,
    appliedPromo,
    handleApplyPromo,
    handleRemovePromo,
  };
};
