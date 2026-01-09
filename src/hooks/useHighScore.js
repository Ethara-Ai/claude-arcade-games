import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

/**
 * Custom hook for managing high scores with localStorage persistence
 * @param {string} storageKey - Key for localStorage
 * @param {number} initialScore - Initial high score if none exists
 * @returns {Object} High score state and updater
 */
export const useHighScore = (storageKey, initialScore = 0) => {
  const [highScore, setHighScore] = useState(() => {
    return getStorageItem(storageKey, initialScore);
  });

  // Update high score if current score is higher
  const updateHighScore = useCallback(
    (newScore) => {
      if (newScore > highScore) {
        setHighScore(newScore);
        setStorageItem(storageKey, newScore);
        return true; // New high score achieved
      }
      return false; // Not a new high score
    },
    [highScore, storageKey]
  );

  // Reset high score
  const resetHighScore = useCallback(() => {
    setHighScore(initialScore);
    setStorageItem(storageKey, initialScore);
  }, [initialScore, storageKey]);

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const newValue = JSON.parse(e.newValue);
          setHighScore(newValue);
        } catch (error) {
          console.warn('Error parsing storage value:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey]);

  return {
    highScore,
    updateHighScore,
    resetHighScore,
  };
};

export default useHighScore;
