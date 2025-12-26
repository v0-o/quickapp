import { create } from 'zustand';

export const useConfigStore = create((set) => ({
  config: null,
  isLoading: true,
  error: null,
  
  setConfig: (config) => set({ config, error: null }),
  
  updateConfig: (updates) => set((state) => {
    if (!state.config) {
      return { config: updates };
    }
    // Deep merge for nested objects like categories, products
    const newConfig = { ...state.config };
    Object.keys(updates).forEach(key => {
      if (Array.isArray(updates[key])) {
        // For arrays (categories, products), replace entirely
        newConfig[key] = updates[key];
      } else if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
        // For objects, merge
        newConfig[key] = { ...newConfig[key], ...updates[key] };
      } else {
        // For primitives, replace
        newConfig[key] = updates[key];
      }
    });
    return { config: newConfig };
  }),
  
  updateTheme: (themeUpdates) => set((state) => {
    if (!state.config) return state;
    return {
      config: {
        ...state.config,
        theme: { ...state.config.theme, ...themeUpdates },
      },
    };
  }),
  
  updateBrand: (brandUpdates) => set((state) => {
    if (!state.config) return state;
    return {
      config: {
        ...state.config,
        brand: { ...state.config.brand, ...brandUpdates },
      },
    };
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));

