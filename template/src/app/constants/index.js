// Template Constants File
// This file loads constants from the configuration file

import {
  getPricing,
  getDelivery,
  getPromoCodes,
  getCategories
} from '../../config/loader.js';

// Storage keys (these remain constant across all instances)
export const WELCOME_STORAGE_KEY = "webapp_welcome_shown";
export const THEME_STORAGE_KEY = "webapp_theme";
export const CART_STORAGE_KEY = "webapp_cart";
export const WISHLIST_STORAGE_KEY = "webapp_wishlist";
export const FAVORITES_STORAGE_KEY = "webapp_favorites";
export const DELIVERY_CITY_STORAGE_KEY = "webapp_delivery_city";
export const PAYMENT_METHOD_STORAGE_KEY = "webapp_payment_method";
export const PROMO_CODE_STORAGE_KEY = "webapp_promo_code";
export const ORDER_HISTORY_STORAGE_KEY = "webapp_order_history";
export const USER_STORAGE_KEY = "webapp_user";

// These will be populated from config
export let PRICES_PER_CATEGORY = {};
export let PRICES = {};
export let DELIVERY_PRICES = {};
export let PROMO_CODES = {};
export let QUANTITY_OPTIONS = [5, 10, 20];
export let MIN_QUANTITY = 5;
export let MIN_WEIGHT = 15;
export let CATEGORIES = [];

// Helper functions to get values from config
export function getPricesPerCategory() {
  try {
    const pricing = getPricing();
    return pricing.pricesPerCategory || {};
  } catch (error) {
    console.error('Failed to load pricing from config:', error);
    return {};
  }
}

export function getDeliveryPrices() {
  try {
    const delivery = getDelivery();
    return delivery.cities || {};
  } catch (error) {
    console.error('Failed to load delivery prices from config:', error);
    return {};
  }
}

export function getPromoCodesData() {
  try {
    return getPromoCodes() || {};
  } catch (error) {
    console.error('Failed to load promo codes from config:', error);
    return {};
  }
}

export function getCategoriesData() {
  try {
    return getCategories() || [];
  } catch (error) {
    console.error('Failed to load categories from config:', error);
    return [];
  }
}

export function getQuantityOptions() {
  try {
    const pricing = getPricing();
    return pricing.quantityOptions || [5, 10, 20];
  } catch (error) {
    return [5, 10, 20];
  }
}

export function getMinQuantity() {
  try {
    const pricing = getPricing();
    return pricing.minQuantity || 5;
  } catch (error) {
    return 5;
  }
}

export function getMinWeight() {
  try {
    const pricing = getPricing();
    return pricing.minWeight || 15;
  } catch (error) {
    return 15;
  }
}

// Initialize all constants from config
export function initializeConstants() {
  PRICES_PER_CATEGORY = getPricesPerCategory();
  PRICES = PRICES_PER_CATEGORY;
  DELIVERY_PRICES = getDeliveryPrices();
  PROMO_CODES = getPromoCodesData();
  CATEGORIES = getCategoriesData();
  QUANTITY_OPTIONS = getQuantityOptions();
  MIN_QUANTITY = getMinQuantity();
  MIN_WEIGHT = getMinWeight();

  return {
    PRICES_PER_CATEGORY,
    PRICES,
    DELIVERY_PRICES,
    PROMO_CODES,
    CATEGORIES,
    QUANTITY_OPTIONS,
    MIN_QUANTITY,
    MIN_WEIGHT,
  };
}
