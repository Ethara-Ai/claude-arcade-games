import { useState, useCallback } from 'react';
import { GAME_STATES } from '../utils/constants';

/**
 * Custom hook for managing game state machine
 * Handles transitions between different game states
 * @param {string} initialState - Initial game state
 * @returns {Object} Current state and transition functions
 */
export const useGameState = (initialState = GAME_STATES.START) => {
  const [gameState, setGameState] = useState(initialState);
  const [previousState, setPreviousState] = useState(null);

  const transitionTo = useCallback((newState) => {
    setGameState((current) => {
      setPreviousState(current);
      return newState;
    });
  }, []);

  const startGame = useCallback(() => {
    transitionTo(GAME_STATES.PLAYING);
  }, [transitionTo]);

  const pauseGame = useCallback(() => {
    if (gameState === GAME_STATES.PLAYING) {
      transitionTo(GAME_STATES.PAUSED);
    }
  }, [gameState, transitionTo]);

  const resumeGame = useCallback(() => {
    if (gameState === GAME_STATES.PAUSED) {
      transitionTo(GAME_STATES.PLAYING);
    }
  }, [gameState, transitionTo]);

  const endGame = useCallback(() => {
    transitionTo(GAME_STATES.GAME_OVER);
  }, [transitionTo]);

  const winGame = useCallback(() => {
    transitionTo(GAME_STATES.WON);
  }, [transitionTo]);

  const resetGame = useCallback(() => {
    transitionTo(GAME_STATES.START);
  }, [transitionTo]);

  const togglePause = useCallback(() => {
    if (gameState === GAME_STATES.PLAYING) {
      pauseGame();
    } else if (gameState === GAME_STATES.PAUSED) {
      resumeGame();
    }
  }, [gameState, pauseGame, resumeGame]);

  return {
    gameState,
    previousState,
    isStart: gameState === GAME_STATES.START,
    isPlaying: gameState === GAME_STATES.PLAYING,
    isPaused: gameState === GAME_STATES.PAUSED,
    isGameOver: gameState === GAME_STATES.GAME_OVER,
    isWon: gameState === GAME_STATES.WON,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    winGame,
    resetGame,
    togglePause,
    transitionTo,
  };
};

export default useGameState;
