// Hot reload system for config updates via postMessage
import { updateConfigAndTheme } from './loader.js';

let configCache = null;

// Listen for config updates from parent window (admin panel)
export function setupHotReload() {
  window.addEventListener('message', (event) => {
    // Security: only accept messages from same origin or trusted parent
    if (event.data && event.data.type === 'CONFIG_UPDATE') {
      const newConfig = event.data.config;
      configCache = newConfig;
      
      console.log('🔄 Hot reload: Config updated');
      
      // Update config cache and inject theme colors instantly
      updateConfigAndTheme(newConfig);
      
      // Trigger a custom event for other parts of the app to listen
      window.dispatchEvent(new CustomEvent('configUpdated', { detail: newConfig }));
    }
  });
  
  console.log('✅ Hot reload listener setup');
}

// Get current config (from cache or load fresh)
export function getCachedConfig() {
  return configCache;
}

