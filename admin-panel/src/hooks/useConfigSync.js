import { useEffect, useRef } from 'react';
import { useConfigStore } from '../store/configStore.js';

export function useConfigSync() {
  const { config } = useConfigStore();
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!config) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce save (150ms - reduced for faster sync)
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch('/api/config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config, null, 2),
        });

        if (!response.ok) {
          throw new Error('Failed to save config');
        }
      } catch (error) {
        console.error('Error saving config:', error);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [config]);
}

