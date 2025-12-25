import { create } from 'zustand';
import { StorageManager } from '../app/utils/storage.js';

export const useSettingsStore = create((set) => ({
  theme: 'dark',
  setTheme: async (newTheme) => {
    set({ theme: newTheme });
    if (typeof document !== 'undefined') {
      document.documentElement.className = newTheme === 'light' ? 'theme-light' : '';
    }
    await StorageManager.saveTheme(newTheme);
  },

  deliveryCity: 'rabat',
  setDeliveryCity: async (city) => {
    set({ deliveryCity: city });
    await StorageManager.saveDeliveryCity(city);
  },

  paymentMethod: 'cash',
  setPaymentMethod: async (method) => {
    set({ paymentMethod: method });
    await StorageManager.savePaymentMethod(method);
  },

  appliedPromo: '',
  setAppliedPromo: async (code) => {
    set({ appliedPromo: code });
    await StorageManager.savePromoCode(code);
  },

  wishlist: [],
  setWishlist: async (newWishlist) => {
    set({ wishlist: newWishlist });
    await StorageManager.saveWishlist(newWishlist);
  },

  orderHistory: [],
  setOrderHistory: async (newHistory) => {
    set({ orderHistory: newHistory });
    await StorageManager.saveOrderHistory(newHistory);
  },
}));
