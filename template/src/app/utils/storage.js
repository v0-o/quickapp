import {
  CART_STORAGE_KEY,
  DELIVERY_CITY_STORAGE_KEY,
  ORDER_HISTORY_STORAGE_KEY,
  PAYMENT_METHOD_STORAGE_KEY,
  PROMO_CODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  WISHLIST_STORAGE_KEY,
} from '../constants/index.js';

const ensureWindow = () => (typeof window !== 'undefined' ? window : undefined);

const buildCloudStorageAdapter = (cloudStorage) => {
  const wrap = (method, ...args) => new Promise((resolve, reject) => {
    try {
      method.call(cloudStorage, ...args, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    } catch (runtimeError) {
      reject(runtimeError);
    }
  });

  return {
    async get(key) {
      const value = await wrap(cloudStorage.getItem, key);
      return value != null ? { value } : null;
    },
    async set(key, value) {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      await wrap(cloudStorage.setItem, key, serialized);
      return true;
    },
    async remove(key) {
      await wrap(cloudStorage.removeItem, key);
      return true;
    },
  };
};

const buildLocalStorageAdapter = (win) => ({
  async get(key) {
    const value = win.localStorage.getItem(key);
    return value != null ? { value } : null;
  },
  async set(key, value) {
    win.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    return true;
  },
  async remove(key) {
    win.localStorage.removeItem(key);
    return true;
  },
});

const getStorageBackend = () => {
  const win = ensureWindow();
  if (!win) return null;

  if (win.Telegram?.WebApp?.CloudStorage) {
    return buildCloudStorageAdapter(win.Telegram.WebApp.CloudStorage);
  }

  if (win.storage && typeof win.storage.get === 'function' && typeof win.storage.set === 'function') {
    return win.storage;
  }

  try {
    return buildLocalStorageAdapter(win);
  } catch (error) {
    console.warn('No storage backend available', error);
    return null;
  }
};

const safeParse = (value, fallback) => {
  try {
    return value != null ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const createStorageManager = (backend) => ({
  async saveCart(cart) {
    if (!backend) return false;
    try {
      await backend.set(CART_STORAGE_KEY, cart);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  async loadCart() {
    if (!backend) return [];
    try {
      const result = await backend.get(CART_STORAGE_KEY);
      return safeParse(result?.value, []);
    } catch (error) {
      return [];
    }
  },

  async saveDeliveryCity(city) {
    if (!backend) return false;
    try {
      await backend.set(DELIVERY_CITY_STORAGE_KEY, city);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  async loadDeliveryCity() {
    if (!backend) return 'rabat';
    try {
      const result = await backend.get(DELIVERY_CITY_STORAGE_KEY);
      return result?.value || 'rabat';
    } catch {
      return 'rabat';
    }
  },

  async savePaymentMethod(method) {
    if (!backend) return false;
    try {
      await backend.set(PAYMENT_METHOD_STORAGE_KEY, method);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  async loadPaymentMethod() {
    if (!backend) return 'cash';
    try {
      const result = await backend.get(PAYMENT_METHOD_STORAGE_KEY);
      return result?.value || 'cash';
    } catch {
      return 'cash';
    }
  },

  async savePromoCode(code) {
    if (!backend) return false;
    try {
      await backend.set(PROMO_CODE_STORAGE_KEY, code);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  async loadPromoCode() {
    if (!backend) return '';
    try {
      const result = await backend.get(PROMO_CODE_STORAGE_KEY);
      return result?.value || '';
    } catch {
      return '';
    }
  },

  async saveWishlist(wishlist) {
    if (!backend) return false;
    try {
      await backend.set(WISHLIST_STORAGE_KEY, wishlist);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  async loadWishlist() {
    if (!backend) return [];
    try {
      const result = await backend.get(WISHLIST_STORAGE_KEY);
      return safeParse(result?.value, []);
    } catch (error) {
      return [];
    }
  },

  async saveOrderHistory(orders) {
    if (!backend) return false;
    try {
      await backend.set(ORDER_HISTORY_STORAGE_KEY, orders);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  async loadOrderHistory() {
    if (!backend) return [];
    try {
      const result = await backend.get(ORDER_HISTORY_STORAGE_KEY);
      return safeParse(result?.value, []);
    } catch (error) {
      return [];
    }
  },

  async saveTheme(theme) {
    if (!backend) return false;
    try {
      await backend.set(THEME_STORAGE_KEY, theme);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },

  async loadTheme() {
    if (!backend) return 'dark';
    try {
      const result = await backend.get(THEME_STORAGE_KEY);
      return result?.value || 'dark';
    } catch {
      return 'dark';
    }
  },
});

const storageBackend = getStorageBackend();

export const StorageManager = createStorageManager(storageBackend);

export const createCloudStorageManager = (cloudStorage) => {
  if (!cloudStorage) return StorageManager;
  return createStorageManager(buildCloudStorageAdapter(cloudStorage));
};
