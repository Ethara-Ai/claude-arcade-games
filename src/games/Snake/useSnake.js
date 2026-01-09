import { useState, useCallback, useRef, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useHighScore } from '../../hooks/useHighScore';
import { STORAGE_KEYS, GAME_STATES } from '../../utils/constants';
import { randomInt } from '../../utils/helpers';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const BASE_SPEED = 150; // ms per move
const MIN_SPEED = 60;
const SPEED_INCREASE_PER_SCORE = 50;

/**
 * Custom hook for Snake game logic
 */
export const useSnake = () => {
  const { gameState, startGame, pauseGame, resumeGame, endGame, resetGame } = useGameState();
  const { highScore, updateHighScore } = useHighScore(STORAGE_KEYS.HIGH_SCORE_SNAKE, 0);

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 15, type: 'normal' });
  const [bonusFood, setBonusFood] = useState(null);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(BASE_SPEED);

  const canvasRef = useRef(null);
  const nextDirectionRef = useRef(INITIAL_DIRECTION);
  const lastMoveTimeRef = useRef(0);
  const bonusFoodTimerRef = useRef(null);

  // Generate random food position
  const generateFood = useCallback(
    (currentSnake, isBonus = false) => {
      let newFood;
      let attempts = 0;
      do {
        newFood = {
          x: randomInt(0, GRID_SIZE - 1),
          y: randomInt(0, GRID_SIZE - 1),
          type: isBonus ? 'bonus' : 'normal',
        };
        attempts++;
      } while (
        attempts < 100 &&
        currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
      );

      return newFood;
    },
    []
  );

  // Initialize game
  const initializeGame = useCallback(() => {
    const initialSnake = [...INITIAL_SNAKE];
    setSnake(initialSnake);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(initialSnake, false));
    setBonusFood(null);
    setScore(0);
    setSpeed(BASE_SPEED);
    lastMoveTimeRef.current = 0;

    // Clear any existing bonus food timer
    if (bonusFoodTimerRef.current) {
      clearTimeout(bonusFoodTimerRef.current);
      bonusFoodTimerRef.current = null;
    }
  }, [generateFood]);

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

  // Change direction (with validation to prevent reversing)
  const changeDirection = useCallback((newDirection) => {
    const current = nextDirectionRef.current;
    
    // Prevent reversing direction
    if (
      (newDirection.x === -current.x && newDirection.x !== 0) ||
      (newDirection.y === -current.y && newDirection.y !== 0)
    ) {
      return;
    }

    nextDirectionRef.current = newDirection;
  }, []);

  // Spawn bonus food occasionally
  const spawnBonusFood = useCallback(() => {
    if (bonusFoodTimerRef.current) return;

    bonusFoodTimerRef.current = setTimeout(
      () => {
        setBonusFood((current) => {
          if (current) return current;
          return generateFood(snake, true);
        });

        // Remove bonus food after 5 seconds
        setTimeout(() => {
          setBonusFood(null);
        }, 5000);

        bonusFoodTimerRef.current = null;
      },
      randomInt(5000, 10000)
    );
  }, [snake, generateFood]);

  // Update game state
  const update = useCallback(
    (currentTime) => {
      if (gameState !== GAME_STATES.PLAYING) return;

      // Check if enough time has passed
      if (currentTime - lastMoveTimeRef.current < speed) return;
      lastMoveTimeRef.current = currentTime;

      // Update direction
      setDirection(nextDirectionRef.current);

      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const newHead = {
          x: head.x + nextDirectionRef.current.x,
          y: head.y + nextDirectionRef.current.y,
        };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setTimeout(() => {
            updateHighScore(score);
            endGame();
          }, 0);
          return currentSnake;
        }

        // Check self collision
        if (currentSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setTimeout(() => {
            updateHighScore(score);
            endGame();
          }, 0);
          return currentSnake;
        }

        const newSnake = [newHead, ...currentSnake];

        // Check food collision
        let ate = false;
        let points = 0;

        if (newHead.x === food.x && newHead.y === food.y) {
          ate = true;
          points = 10;
          setFood(generateFood(newSnake, false));
          spawnBonusFood();
        } else if (bonusFood && newHead.x === bonusFood.x && newHead.y === bonusFood.y) {
          ate = true;
          points = 50;
          setBonusFood(null);
        }

        if (ate) {
          setScore((prev) => {
            const newScore = prev + points;
            // Increase speed based on score
            const newSpeed = Math.max(
              MIN_SPEED,
              BASE_SPEED - Math.floor(newScore / SPEED_INCREASE_PER_SCORE) * 10
            );
            setSpeed(newSpeed);
            return newScore;
          });
        } else {
          newSnake.pop(); // Remove tail if didn't eat
        }

        return newSnake;
      });
    },
    [gameState, speed, score, food, bonusFood, generateFood, spawnBonusFood, updateHighScore, endGame]
  );

  // Initialize on mount
  useEffect(() => {
    initializeGame();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bonusFoodTimerRef.current) {
        clearTimeout(bonusFoodTimerRef.current);
      }
    };
  }, []);

  return {
    // State
    gameState,
    snake,
    direction,
    food,
    bonusFood,
    score,
    highScore,
    speed,
    canvasRef,
    GRID_SIZE,
    CELL_SIZE,
    CANVAS_SIZE,

    // Actions
    handleStart,
    handleRestart,
    pauseGame,
    resumeGame,
    resetGame,
    changeDirection,
    update,
  };
};
