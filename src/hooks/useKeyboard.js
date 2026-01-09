import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for keyboard input handling
 * @param {Object} keyMap - Object mapping key names to handler functions
 * @param {boolean} enabled - Whether keyboard input should be enabled
 * @returns {Object} Current pressed keys state
 */
export const useKeyboard = (keyMap = {}, enabled = true) => {
  const [pressedKeys, setPressedKeys] = useState({});

  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;

      const key = event.key;
      setPressedKeys((prev) => ({ ...prev, [key]: true }));

      // Check if this key has a handler in the keyMap
      if (keyMap[key]) {
        event.preventDefault();
        keyMap[key](event);
      }
    },
    [enabled, keyMap]
  );

  const handleKeyUp = useCallback(
    (event) => {
      if (!enabled) return;

      const key = event.key;
      setPressedKeys((prev) => ({ ...prev, [key]: false }));
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) {
      setPressedKeys({});
      return;
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, handleKeyDown, handleKeyUp]);

  // Helper to check if a key is currently pressed
  const isKeyPressed = useCallback(
    (key) => {
      return !!pressedKeys[key];
    },
    [pressedKeys]
  );

  // Helper to check if any of multiple keys are pressed
  const isAnyKeyPressed = useCallback(
    (keys) => {
      return keys.some((key) => pressedKeys[key]);
    },
    [pressedKeys]
  );

  return {
    pressedKeys,
    isKeyPressed,
    isAnyKeyPressed,
  };
};

export default useKeyboard;
