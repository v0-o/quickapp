// Configuration Loader
// This file loads the configuration from config.json

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
    body.style.backgroundColor = theme.backgroundColor;
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

export async function loadConfig() {
  if (config) return config;

  // Retry logic: try up to 3 times with increasing delays
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Fetching config.json (attempt ${attempt}/${maxRetries}) from:`, window.location.origin);
      
      // Create timeout abort controller for 5 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch("/config.json", {
        cache: "no-cache", // Always fetch fresh config
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      config = await response.json();
      console.log("✅ Config loaded successfully");

      // Inject theme colors immediately
      if (config.theme) {
        injectThemeColors(config.theme);
      }

      return config;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);
      
      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = attempt * 500; // 500ms, 1000ms, 1500ms
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  console.error("❌ Failed to load config after all retries:", lastError);
  console.error("📍 Current origin:", window.location.origin);
  console.error("📍 Attempted URL:", `${window.location.origin}/config.json`);
  throw new Error(`Configuration file not found after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
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
}
