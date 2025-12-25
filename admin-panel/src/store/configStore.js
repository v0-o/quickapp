import { create } from 'zustand';

export const useConfigStore = create((set) => ({
  config: null,
  isLoading: true,
  error: null,
  
  setConfig: (config) => set({ config, error: null }),
  
  updateConfig: (updates) => set((state) => ({
    config: state.config ? { ...state.config, ...updates } : updates,
  })),
  
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

