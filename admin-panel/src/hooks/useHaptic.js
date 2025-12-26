import { useCallback } from 'react';

/**
 * Hook for haptic feedback with iOS-style patterns
 * Supports different intensity levels and patterns
 */
export function useHaptic() {
  // Check if haptics are supported
  const isSupported = typeof navigator !== 'undefined' && 
    (navigator.vibrate || navigator.vibrate !== undefined);

  // Haptic patterns (duration in ms)
  const patterns = {
    light: [10],           // Subtle tap
    medium: [20],          // Standard button press
    heavy: [30],           // Important action
    success: [20, 10, 20], // Success pattern: tap-pause-tap
    error: [30, 20, 30],   // Error pattern: strong-pause-strong
    selection: [5],        // Selection change
  };

  const trigger = useCallback((type = 'medium') => {
    if (!isSupported) return;

    const pattern = patterns[type] || patterns.medium;
    
    try {
      // Use Vibration API
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (error) {
      // Silently fail if haptics not supported
      console.debug('Haptic feedback not available:', error);
    }
  }, [isSupported]);

  // Convenience methods
  const light = useCallback(() => trigger('light'), [trigger]);
  const medium = useCallback(() => trigger('medium'), [trigger]);
  const heavy = useCallback(() => trigger('heavy'), [trigger]);
  const success = useCallback(() => trigger('success'), [trigger]);
  const error = useCallback(() => trigger('error'), [trigger]);
  const selection = useCallback(() => trigger('selection'), [trigger]);

  return {
    trigger,
    light,
    medium,
    heavy,
    success,
    error,
    selection,
    isSupported,
  };
}

