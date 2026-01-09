import { useState, useCallback, useRef, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useHighScore } from '../../hooks/useHighScore';
import { STORAGE_KEYS, GAME_STATES } from '../../utils/constants';
import { levels, BRICK_TYPES, POWER_UPS } from './levels';

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_WIDE_WIDTH = 150;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;
const BALL_SPEED = 300;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 25;
const BRICK_PADDING = 5;
const BRICK_OFFSET_TOP = 50;
const BRICK_OFFSET_LEFT = 35;
const POWER_UP_SIZE = 20;
const POWER_UP_FALL_SPEED = 100;

/**
 * Custom hook for Brickrush game logic
 */
export const useBrickrush = () => {
  const { gameState, startGame, pauseGame, resumeGame, endGame, resetGame } = useGameState();
  const { highScore, updateHighScore } = useHighScore(STORAGE_KEYS.HIGH_SCORE_BRICKRUSH, 0);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [paddle, setPaddle] = useState({
    x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
    y: CANVAS_HEIGHT - 40,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  });
  const [balls, setBalls] = useState([
    {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 60,
      dx: 0,
      dy: 0,
      launched: false,
    },
  ]);
  const [bricks, setBricks] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [activePowerUps, setActivePowerUps] = useState({
    widePaddle: null,
  });

  const canvasRef = useRef(null);
  const mouseXRef = useRef(CANVAS_WIDTH / 2);

  // Initialize level
  const initializeLevel = useCallback((levelNum) => {
    const levelData = levels[levelNum - 1];
    if (!levelData) return false;

    const newBricks = levelData.bricks.map((brick) => ({
      ...brick,
      x: brick.col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
      y: brick.row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
      width: BRICK_WIDTH,
      height: BRICK_HEIGHT,
      destroyed: false,
    }));

    setBricks(newBricks);
    return true;
  }, []);

  // Initialize game
  const initializeGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setPaddle({
      x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: CANVAS_HEIGHT - 40,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    });
    setBalls([
      {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT - 60,
        dx: 0,
        dy: 0,
        launched: false,
      },
    ]);
    setPowerUps([]);
    setActivePowerUps({ widePaddle: null });
    initializeLevel(1);
  }, [initializeLevel]);

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

  // Launch ball
  const launchBall = useCallback(() => {
    setBalls((prevBalls) =>
      prevBalls.map((ball) => {
        if (!ball.launched) {
          const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6; // -30 to 30 degrees
          return {
            ...ball,
            dx: Math.sin(angle) * BALL_SPEED,
            dy: -Math.cos(angle) * BALL_SPEED,
            launched: true,
          };
        }
        return ball;
      })
    );
  }, []);

  // Move paddle
  const movePaddle = useCallback((x) => {
    setPaddle((prev) => ({
      ...prev,
      x: Math.max(0, Math.min(CANVAS_WIDTH - prev.width, x - prev.width / 2)),
    }));
  }, []);

  // Update game state
  const update = useCallback(
    (deltaTime) => {
      if (gameState !== GAME_STATES.PLAYING) return;

      // Update balls
      setBalls((prevBalls) => {
        let newBalls = prevBalls
          .map((ball) => {
            if (!ball.launched) {
              // Ball follows paddle
              return {
                ...ball,
                x: paddle.x + paddle.width / 2,
              };
            }

            let newX = ball.x + ball.dx * deltaTime;
            let newY = ball.y + ball.dy * deltaTime;
            let newDx = ball.dx;
            let newDy = ball.dy;

            // Wall collision
            if (newX - BALL_RADIUS < 0 || newX + BALL_RADIUS > CANVAS_WIDTH) {
              newDx = -newDx;
              newX = Math.max(BALL_RADIUS, Math.min(CANVAS_WIDTH - BALL_RADIUS, newX));
            }
            if (newY - BALL_RADIUS < 0) {
              newDy = -newDy;
              newY = BALL_RADIUS;
            }

            // Paddle collision
            if (
              newY + BALL_RADIUS > paddle.y &&
              newY - BALL_RADIUS < paddle.y + paddle.height &&
              newX > paddle.x &&
              newX < paddle.x + paddle.width
            ) {
              newDy = -Math.abs(newDy);
              // Add English based on where ball hits paddle
              const hitPos = (newX - paddle.x) / paddle.width - 0.5;
              newDx += hitPos * BALL_SPEED * 0.5;
              newY = paddle.y - BALL_RADIUS;
            }

            // Ball fell below paddle
            if (newY - BALL_RADIUS > CANVAS_HEIGHT) {
              return null; // Mark for removal
            }

            return { ...ball, x: newX, y: newY, dx: newDx, dy: newDy };
          })
          .filter(Boolean);

        // Check if all balls lost
        if (newBalls.length === 0) {
          setLives((prev) => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setTimeout(() => {
                updateHighScore(score);
                endGame();
              }, 100);
            }
            return newLives;
          });

          // Reset with new ball
          return [
            {
              x: CANVAS_WIDTH / 2,
              y: CANVAS_HEIGHT - 60,
              dx: 0,
              dy: 0,
              launched: false,
            },
          ];
        }

        return newBalls;
      });

      // Update brick collisions
      setBricks((prevBricks) => {
        let bricksDestroyed = 0;
        const newBricks = prevBricks.map((brick) => {
          if (brick.destroyed) return brick;

          for (let ball of balls) {
            if (!ball || !ball.launched) continue;

            // Simple AABB collision
            if (
              ball.x + BALL_RADIUS > brick.x &&
              ball.x - BALL_RADIUS < brick.x + brick.width &&
              ball.y + BALL_RADIUS > brick.y &&
              ball.y - BALL_RADIUS < brick.y + brick.height
            ) {
              // Bounce ball
              setBalls((prevBalls) =>
                prevBalls.map((b) => {
                  if (b === ball) {
                    return { ...b, dy: -b.dy };
                  }
                  return b;
                })
              );

              // Steel bricks don't break
              if (brick.type === BRICK_TYPES.STEEL) {
                return brick;
              }

              // Destroy brick and add score
              setScore((prev) => prev + level * 10);
              bricksDestroyed++;

              // Drop power-up
              if (brick.powerUp) {
                setPowerUps((prev) => [
                  ...prev,
                  {
                    x: brick.x + brick.width / 2,
                    y: brick.y,
                    type: brick.powerUp,
                  },
                ]);
              }

              return { ...brick, destroyed: true };
            }
          }

          return brick;
        });

        return newBricks;
      });

      // Update power-ups
      setPowerUps((prevPowerUps) => {
        return prevPowerUps
          .map((powerUp) => {
            const newY = powerUp.y + POWER_UP_FALL_SPEED * deltaTime;

            // Check collision with paddle
            if (
              newY + POWER_UP_SIZE > paddle.y &&
              newY < paddle.y + paddle.height &&
              powerUp.x + POWER_UP_SIZE > paddle.x &&
              powerUp.x < paddle.x + paddle.width
            ) {
              // Activate power-up
              if (powerUp.type === POWER_UPS.MULTI_BALL) {
                setBalls((prev) => {
                  // Add 2 more balls
                  const newBalls = prev.map((ball) => {
                    if (ball.launched) {
                      const angle1 = Math.PI / 6;
                      const angle2 = -Math.PI / 6;
                      return [
                        ball,
                        {
                          ...ball,
                          dx: Math.cos(angle1) * BALL_SPEED,
                          dy: Math.sin(angle1) * BALL_SPEED,
                        },
                        {
                          ...ball,
                          dx: Math.cos(angle2) * BALL_SPEED,
                          dy: Math.sin(angle2) * BALL_SPEED,
                        },
                      ];
                    }
                    return [ball];
                  });
                  return newBalls.flat();
                });
              } else if (powerUp.type === POWER_UPS.WIDE_PADDLE) {
                setPaddle((prev) => ({ ...prev, width: PADDLE_WIDE_WIDTH }));
                setActivePowerUps((prev) => ({ ...prev, widePaddle: Date.now() }));
                // Reset after 10 seconds
                setTimeout(() => {
                  setPaddle((prev) => ({ ...prev, width: PADDLE_WIDTH }));
                  setActivePowerUps((prev) => ({ ...prev, widePaddle: null }));
                }, 10000);
              }

              return null; // Remove power-up
            }

            // Remove if off screen
            if (newY > CANVAS_HEIGHT) {
              return null;
            }

            return { ...powerUp, y: newY };
          })
          .filter(Boolean);
      });

      // Check if level complete
      const normalBricksRemaining = bricks.filter(
        (b) => !b.destroyed && b.type === BRICK_TYPES.NORMAL
      ).length;

      if (normalBricksRemaining === 0) {
        const nextLevel = level + 1;
        if (nextLevel <= levels.length) {
          setLevel(nextLevel);
          initializeLevel(nextLevel);
          // Reset ball
          setBalls([
            {
              x: CANVAS_WIDTH / 2,
              y: CANVAS_HEIGHT - 60,
              dx: 0,
              dy: 0,
              launched: false,
            },
          ]);
        } else {
          // Won the game!
          setTimeout(() => {
            updateHighScore(score);
            endGame();
          }, 100);
        }
      }
    },
    [gameState, balls, bricks, paddle, level, score, initializeLevel, updateHighScore, endGame]
  );

  // Initialize first level
  useEffect(() => {
    initializeLevel(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // State
    gameState,
    score,
    highScore,
    lives,
    level,
    paddle,
    balls,
    bricks,
    powerUps,
    canvasRef,
    mouseXRef,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,

    // Actions
    handleStart,
    handleRestart,
    pauseGame,
    resumeGame,
    resetGame,
    launchBall,
    movePaddle,
    update,
  };
};
