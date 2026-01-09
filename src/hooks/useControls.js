import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for unified keyboard and touch controls
 * Includes swipe gesture detection
 * @param {boolean} enabled - Whether controls should be enabled
 * @returns {Object} Control state and handlers
 */
export const useControls = (enabled = true) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const swipeCallbackRef = useRef(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = useCallback(
    (e) => {
      if (!enabled) return;
      setTouchEnd(null);
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    },
    [enabled]
  );

  const onTouchMove = useCallback(
    (e) => {
      if (!enabled) return;
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    },
    [enabled]
  );

  const onTouchEnd = useCallback(() => {
    if (!enabled || !touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    let direction = null;

    if (isHorizontalSwipe) {
      if (Math.abs(distanceX) > minSwipeDistance) {
        direction = distanceX > 0 ? 'left' : 'right';
      }
    } else {
      if (Math.abs(distanceY) > minSwipeDistance) {
        direction = distanceY > 0 ? 'up' : 'down';
      }
    }

    if (direction && swipeCallbackRef.current) {
      swipeCallbackRef.current(direction);
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [enabled, touchStart, touchEnd]);

  // Register swipe callback
  const onSwipe = useCallback((callback) => {
    swipeCallbackRef.current = callback;
  }, []);

  // Helper to get current touch position
  const getCurrentTouch = useCallback(() => {
    return touchEnd || touchStart;
  }, [touchEnd, touchStart]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onSwipe,
    getCurrentTouch,
    isTouching: touchStart !== null,
  };
};

export default useControls;
