import { useState, useCallback, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useHighScore } from '../../hooks/useHighScore';
import { STORAGE_KEYS, GAME_STATES } from '../../utils/constants';
import { randomInt } from '../../utils/helpers';

const GRID_SIZE = 4;
const WIN_TILE = 1024;

/**
 * Tile colors based on value
 */
export const getTileColor = (value) => {
  const colors = {
    2: 'bg-blue-200 text-gray-800',
    4: 'bg-blue-300 text-gray-800',
    8: 'bg-cyan-400 text-white',
    16: 'bg-cyan-500 text-white',
    32: 'bg-teal-500 text-white',
    64: 'bg-teal-600 text-white',
    128: 'bg-orange-400 text-white',
    256: 'bg-orange-500 text-white',
    512: 'bg-pink-400 text-white',
    1024: 'bg-accent-cyan text-white',
    2048: 'bg-accent-pink text-white',
  };
  return colors[value] || 'bg-purple-500 text-white';
};

/**
 * Custom hook for 1024 game logic
 */
export const use1024 = () => {
  const { gameState, startGame, pauseGame, resumeGame, endGame, winGame, resetGame, transitionTo } = useGameState();
  const { highScore, updateHighScore } = useHighScore(STORAGE_KEYS.HIGH_SCORE_1024, 0);

  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [mergedTiles, setMergedTiles] = useState(new Set());

  // Create empty grid
  const createEmptyGrid = useCallback(() => {
    return Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null));
  }, []);

  // Get empty cells
  const getEmptyCells = useCallback((currentGrid) => {
    const empty = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (currentGrid[r][c] === null) {
          empty.push({ row: r, col: c });
        }
      }
    }
    return empty;
  }, []);

  // Add random tile
  const addRandomTile = useCallback(
    (currentGrid) => {
      const emptyCells = getEmptyCells(currentGrid);
      if (emptyCells.length === 0) return currentGrid;

      const { row, col } = emptyCells[randomInt(0, emptyCells.length - 1)];
      const value = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4

      const newGrid = currentGrid.map((r) => [...r]);
      newGrid[row][col] = { value, id: Date.now() + Math.random() };
      return newGrid;
    },
    [getEmptyCells]
  );

  // Initialize game
  const initializeGame = useCallback(() => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setHasWon(false);
    setLastMove(null);
    setMergedTiles(new Set());
  }, [createEmptyGrid, addRandomTile]);

  // Start new game
  const handleStart = useCallback(() => {
    initializeGame();
    startGame();
  }, [initializeGame, startGame]);

  // Restart game
  const handleRestart = useCallback(() => {
    initializeGame();
    startGame();
  }, [initializeGame, startGame]);

  // Continue after winning
  const handleContinue = useCallback(() => {
    transitionTo(GAME_STATES.PLAYING);
  }, [transitionTo]);

  // Move tiles in a direction
  const moveTiles = useCallback(
    (direction) => {
      if (gameState !== GAME_STATES.PLAYING) return;

      setMergedTiles(new Set());
      let moved = false;
      let newScore = score;
      const newGrid = grid.map((r) => [...r]);
      const merged = new Set();

      // Helper to move a line (row or column)
      const moveLine = (line) => {
        // Filter out nulls
        const tiles = line.filter((tile) => tile !== null);
        const newLine = [];

        for (let i = 0; i < tiles.length; i++) {
          if (i < tiles.length - 1 && tiles[i].value === tiles[i + 1].value) {
            // Merge tiles
            const mergedValue = tiles[i].value * 2;
            const mergedTile = { value: mergedValue, id: Date.now() + Math.random() };
            newLine.push(mergedTile);
            merged.add(mergedTile.id);
            newScore += mergedValue;
            i++; // Skip next tile as it's merged
            moved = true;

            // Check for win
            if (mergedValue === WIN_TILE && !hasWon) {
              setHasWon(true);
              setTimeout(() => {
                updateHighScore(newScore);
                winGame();
              }, 500);
            }
          } else {
            newLine.push(tiles[i]);
          }
        }

        // Fill rest with nulls
        while (newLine.length < GRID_SIZE) {
          newLine.push(null);
        }

        // Check if line changed
        if (JSON.stringify(line) !== JSON.stringify(newLine)) {
          moved = true;
        }

        return newLine;
      };

      if (direction === 'left') {
        for (let r = 0; r < GRID_SIZE; r++) {
          newGrid[r] = moveLine(newGrid[r]);
        }
      } else if (direction === 'right') {
        for (let r = 0; r < GRID_SIZE; r++) {
          newGrid[r] = moveLine([...newGrid[r]].reverse()).reverse();
        }
      } else if (direction === 'up') {
        for (let c = 0; c < GRID_SIZE; c++) {
          const column = newGrid.map((row) => row[c]);
          const movedColumn = moveLine(column);
          for (let r = 0; r < GRID_SIZE; r++) {
            newGrid[r][c] = movedColumn[r];
          }
        }
      } else if (direction === 'down') {
        for (let c = 0; c < GRID_SIZE; c++) {
          const column = newGrid.map((row) => row[c]);
          const movedColumn = moveLine([...column].reverse()).reverse();
          for (let r = 0; r < GRID_SIZE; r++) {
            newGrid[r][c] = movedColumn[r];
          }
        }
      }

      if (moved) {
        const gridWithNewTile = addRandomTile(newGrid);
        setGrid(gridWithNewTile);
        setScore(newScore);
        setLastMove(direction);
        setMergedTiles(merged);

        // Check for game over
        if (!canMove(gridWithNewTile)) {
          setTimeout(() => {
            updateHighScore(newScore);
            endGame();
          }, 500);
        }
      }
    },
    [gameState, grid, score, hasWon, addRandomTile, updateHighScore, winGame, endGame]
  );

  // Check if any moves are possible
  const canMove = useCallback((currentGrid) => {
    // Check for empty cells
    if (getEmptyCells(currentGrid).length > 0) return true;

    // Check for possible merges
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const current = currentGrid[r][c];
        if (!current) continue;

        // Check right
        if (c < GRID_SIZE - 1 && currentGrid[r][c + 1]?.value === current.value) {
          return true;
        }

        // Check down
        if (r < GRID_SIZE - 1 && currentGrid[r + 1][c]?.value === current.value) {
          return true;
        }
      }
    }

    return false;
  }, [getEmptyCells]);

  // Initialize on mount
  useEffect(() => {
    initializeGame();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // State
    gameState,
    grid,
    score,
    highScore,
    hasWon,
    lastMove,
    mergedTiles,
    GRID_SIZE,

    // Actions
    handleStart,
    handleRestart,
    handleContinue,
    pauseGame,
    resumeGame,
    resetGame,
    moveTiles,
  };
};
