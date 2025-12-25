import { useCallback } from 'react';
import { miniApp as miniAppFeature } from '@tma.js/sdk-react';

export const useHaptic = () => {
  const miniApp = miniAppFeature;

  const light = useCallback(() => {
    miniApp?.HapticFeedback?.impactOccurred?.('light');
  }, [miniApp]);

  const medium = useCallback(() => {
    miniApp?.HapticFeedback?.impactOccurred?.('medium');
  }, [miniApp]);

  const heavy = useCallback(() => {
    miniApp?.HapticFeedback?.impactOccurred?.('heavy');
  }, [miniApp]);

  const success = useCallback(() => {
    miniApp?.HapticFeedback?.notificationOccurred?.('success');
  }, [miniApp]);

  const error = useCallback(() => {
    miniApp?.HapticFeedback?.notificationOccurred?.('error');
  }, [miniApp]);

  const warning = useCallback(() => {
    miniApp?.HapticFeedback?.notificationOccurred?.('warning');
  }, [miniApp]);

  const selection = useCallback(() => {
    miniApp?.HapticFeedback?.selectionChanged?.();
  }, [miniApp]);

  return { light, medium, heavy, success, error, warning, selection };
};
