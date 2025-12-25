// Template Products File
// This file loads products from the configuration file

import { getProducts } from '../../config/loader.js';

// Helper function to add media sources
const withMediaSources = (media = []) =>
  media.map((url) => [{ url, quality: 1 }]);

// Process products from config to add computed fields
function processProducts(products) {
  return products.map(product => ({
    ...product,
    mediaSources: product.media ? withMediaSources(product.media) : [],
    // Ensure all required fields have defaults
    media: product.media || [],
    posters: product.posters || [],
    thumbnail: product.thumbnail || '',
    desc: product.desc || '',
    badge: product.badge || null,
    price: product.price || null,
    oldPrice: product.oldPrice || null,
    isPack: product.isPack || false,
    weight: product.weight || null,
    catalogOnly: product.catalogOnly || false,
    details: product.details || [],
    originalPrice: product.originalPrice || null,
  }));
}

// Export a function that returns products
export function getProductsData() {
  try {
    const products = getProducts();
    return processProducts(products);
  } catch (error) {
    console.error('Failed to load products from config:', error);
    return [];
  }
}

// For backwards compatibility, export as constant
// This will be empty until config is loaded
export let PRODUCTS = [];

// Function to initialize products after config is loaded
export function initializeProducts() {
  PRODUCTS = getProductsData();
  return PRODUCTS;
}
