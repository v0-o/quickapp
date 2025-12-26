// Configuration Loader
// This file loads the configuration from Supabase (production) or config.json (fallback)

import { supabase } from '../lib/supabase.js';

let config = null;

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "0, 0, 0";
}

// Inject theme colors and typography into CSS variables
export function injectThemeColors(theme) {
  if (!theme) return;

  const root = document.documentElement;
  const body = document.body;

  // Inject main colors
  if (theme.primaryColor) {
    root.style.setProperty("--color-primary", theme.primaryColor);
    root.style.setProperty("--color-primary-rgb", hexToRgb(theme.primaryColor));
  }

  if (theme.secondaryColor) {
    root.style.setProperty("--color-secondary", theme.secondaryColor);
    root.style.setProperty(
      "--color-secondary-rgb",
      hexToRgb(theme.secondaryColor),
    );
  }

  if (theme.accentColor) {
    root.style.setProperty("--color-accent", theme.accentColor);
    root.style.setProperty("--color-accent-rgb", hexToRgb(theme.accentColor));
  }

  if (theme.backgroundColor) {
    root.style.setProperty("--color-background", theme.backgroundColor);
    // Apply background to body immediately
    // For neo-brutalist, use gradient if available
    if (theme.customColors?.backgroundGradient) {
      body.style.background = theme.customColors.backgroundGradient;
      body.style.backgroundAttachment = 'fixed';
    } else {
      body.style.backgroundColor = theme.backgroundColor;
    }
  }
  
  // Set theme identifier for CSS targeting
  if (theme.id) {
    root.setAttribute('data-theme', theme.id);
  } else {
    // Try to detect theme from colors
    if (theme.primaryColor === '#000000' && theme.secondaryColor === '#ffff00') {
      root.setAttribute('data-theme', 'neo-brutalist');
    } else if (theme.backgroundColor === '#0a0a0a' && theme.primaryColor === '#ffffff') {
      root.setAttribute('data-theme', 'teenage-engineering');
    }
  }

  if (theme.textColor) {
    root.style.setProperty("--color-text", theme.textColor);
    body.style.color = theme.textColor;
  }

  // Inject typography
  if (theme.fontFamily) {
    root.style.setProperty("--theme-font-family", theme.fontFamily);
    body.style.fontFamily = theme.fontFamily;
  }

  if (theme.fontWeight) {
    root.style.setProperty("--theme-font-weight", theme.fontWeight);
    body.style.fontWeight = theme.fontWeight;
  }

  if (theme.borderRadius) {
    root.style.setProperty("--theme-border-radius", theme.borderRadius);
  }

  if (theme.borderWidth) {
    root.style.setProperty("--theme-border-width", theme.borderWidth);
  }

  // Inject custom colors
  if (theme.customColors) {
    Object.entries(theme.customColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }

  // Update gradient
  if (theme.primaryColor && theme.secondaryColor) {
    root.style.setProperty(
      "--gradient-primary",
      `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
    );
  }

  console.log("✅ Theme colors and typography injected into CSS variables");
}

// Extract slug from URL
function getSlugFromUrl() {
  const path = window.location.pathname;
  // Remove leading/trailing slashes and get slug
  const slug = path.replace(/^\/|\/$/g, '').split('/')[0];
  return slug || null;
}

// Load config from Supabase by slug
async function loadConfigFromSupabase(slug) {
  try {
    console.log(`🔄 Loading config from Supabase for slug: ${slug}`);
    
    const { data, error } = await supabase
      .from('projects')
      .select('config')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error) throw error;
    if (!data || !data.config) {
      throw new Error('Config not found for this slug');
    }

    console.log('✅ Config loaded from Supabase');
    return data.config;
  } catch (error) {
    console.error('❌ Error loading from Supabase:', error);
    throw error;
  }
}

// Fallback: Load config from config.json
async function loadConfigFromFile() {
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Fetching config.json (attempt ${attempt}/${maxRetries})`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch("/config.json", {
        cache: "no-cache",
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const configData = await response.json();
      console.log("✅ Config loaded from config.json");
      return configData;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        const delay = attempt * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed to load config.json after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

export async function loadConfig() {
  if (config) return config;

  try {
    // Try to get slug from URL
    const slug = getSlugFromUrl();
    
    // If we have a slug and Supabase is configured, try loading from Supabase
    if (slug && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      try {
        config = await loadConfigFromSupabase(slug);
      } catch (supabaseError) {
        console.warn('⚠️ Failed to load from Supabase, falling back to config.json:', supabaseError);
        config = await loadConfigFromFile();
      }
    } else {
      // No slug or Supabase not configured, use file fallback
      console.log('📄 Using config.json (no slug in URL or Supabase not configured)');
      config = await loadConfigFromFile();
    }

    // Inject theme colors immediately
    if (config.theme) {
      injectThemeColors(config.theme);
    }

    return config;
  } catch (error) {
    console.error("❌ Failed to load config:", error);
    throw error;
  }
}

export function getConfig() {
  if (!config) {
    throw new Error("Config not loaded yet. Call loadConfig() first.");
  }
  return config;
}

// Helper functions to access specific config sections
export function getBrand() {
  return getConfig().brand;
}

export function getTheme() {
  return getConfig().theme;
}

export function getCategories() {
  return getConfig().categories;
}

export function getProducts() {
  return getConfig().products;
}

export function getPricing() {
  return getConfig().pricing;
}

export function getDelivery() {
  return getConfig().delivery;
}

export function getPromoCodes() {
  return getConfig().promoCodes;
}

export function getContact() {
  return getConfig().contact;
}

export function getSocial() {
  return getConfig().social;
}

export function getSEO() {
  return getConfig().seo;
}

export function getFeatures() {
  return getConfig().features;
}

// Function to update config and re-inject theme colors (for postMessage updates)
export function updateConfigAndTheme(newConfig) {
  config = newConfig;
  if (config.theme) {
    injectThemeColors(config.theme);
  }
  console.log("🔄 Config updated via postMessage, theme re-injected.");
  
  // Trigger config update event to reinitialize constants
  window.dispatchEvent(new CustomEvent('configUpdated', { detail: newConfig }));
}
