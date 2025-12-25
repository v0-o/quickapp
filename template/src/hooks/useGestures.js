import { useRef, useCallback } from 'react';

export const useSwipeGesture = (onSwipeDown, onSwipeUp, threshold = 50) => {
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.changedTouches[0].screenY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    touchEndY.current = e.changedTouches[0].screenY;
    const diff = touchStartY.current - touchEndY.current;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && onSwipeUp) {
        onSwipeUp();
      } else if (diff < 0 && onSwipeDown) {
        onSwipeDown();
      }
    }
  }, [onSwipeDown, onSwipeUp, threshold]);

  return { handleTouchStart, handleTouchEnd };
};

export const useLongPress = (onLongPress, duration = 500) => {
  const timeoutRef = useRef(null);
  const isLongPressRef = useRef(false);

  const handleMouseDown = useCallback(() => {
    isLongPressRef.current = false;
    timeoutRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress?.();
    }, duration);
  }, [onLongPress, duration]);

  const handleMouseUp = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleMouseDown,
    onTouchEnd: handleMouseUp,
  };
};

export const useDoubleTap = (onDoubleTap, delay = 300) => {
  const lastTapRef = useRef(0);

  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < delay) {
      onDoubleTap?.();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }, [onDoubleTap, delay]);

  return { handleTap };
};
