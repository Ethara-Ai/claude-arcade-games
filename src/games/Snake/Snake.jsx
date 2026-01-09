import { useEffect, useRef, useState } from 'react';
import { FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { GAMES, GAME_STATES } from '../../utils/constants';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useControls } from '../../hooks/useControls';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useSnake } from './useSnake';
import StartMenu from '../../components/StartMenu';
import PauseMenu from '../../components/PauseMenu';
import GameOverMenu from '../../components/GameOverMenu';
import HowToPlayModal from '../../components/HowToPlayModal';
import { formatNumber } from '../../utils/helpers';

/**
 * Snake Game Component
 * Classic snake game with canvas rendering
 */
const Snake = ({ onExit }) => {
  const game = useSnake();
  const { isMobile } = useWindowSize();
  const [showHelp, setShowHelp] = useState(false);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const animationFrameRef = useRef(null);

  // Keyboard controls
  useKeyboard(
    {
      ArrowUp: () => game.changeDirection({ x: 0, y: -1 }),
      ArrowDown: () => game.changeDirection({ x: 0, y: 1 }),
      ArrowLeft: () => game.changeDirection({ x: -1, y: 0 }),
      ArrowRight: () => game.changeDirection({ x: 1, y: 0 }),
      w: () => game.changeDirection({ x: 0, y: -1 }),
      W: () => game.changeDirection({ x: 0, y: -1 }),
      s: () => game.changeDirection({ x: 0, y: 1 }),
      S: () => game.changeDirection({ x: 0, y: 1 }),
      a: () => game.changeDirection({ x: -1, y: 0 }),
      A: () => game.changeDirection({ x: -1, y: 0 }),
      d: () => game.changeDirection({ x: 1, y: 0 }),
      D: () => game.changeDirection({ x: 1, y: 0 }),
      p: () => {
        if (game.gameState === GAME_STATES.PLAYING) {
          game.pauseGame();
        } else if (game.gameState === GAME_STATES.PAUSED) {
          game.resumeGame();
        }
      },
      P: () => {
        if (game.gameState === GAME_STATES.PLAYING) {
          game.pauseGame();
        } else if (game.gameState === GAME_STATES.PAUSED) {
          game.resumeGame();
        }
      },
      ' ': () => {
        if (game.gameState === GAME_STATES.PLAYING) {
          game.pauseGame();
        } else if (game.gameState === GAME_STATES.PAUSED) {
          game.resumeGame();
        }
      },
    },
    game.gameState === GAME_STATES.PLAYING || game.gameState === GAME_STATES.PAUSED
  );

  // Touch/swipe controls
  const controls = useControls(game.gameState === GAME_STATES.PLAYING);

  useEffect(() => {
    controls.onSwipe((direction) => {
      const dirMap = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      };
      if (dirMap[direction]) {
        game.changeDirection(dirMap[direction]);
      }
    });
  }, [controls, game]);

  // Game loop
  useEffect(() => {
    if (game.gameState !== GAME_STATES.PLAYING) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    let lastTime = Date.now();
    const gameLoop = () => {
      const currentTime = Date.now();
      game.update(currentTime);
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [game.gameState, game]);

  // Render game
  useEffect(() => {
    const canvas = game.canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, game.CANVAS_SIZE, game.CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= game.GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * game.CELL_SIZE, 0);
      ctx.lineTo(i * game.CELL_SIZE, game.CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * game.CELL_SIZE);
      ctx.lineTo(game.CANVAS_SIZE, i * game.CELL_SIZE);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(
      game.food.x * game.CELL_SIZE + 2,
      game.food.y * game.CELL_SIZE + 2,
      game.CELL_SIZE - 4,
      game.CELL_SIZE - 4
    );

    // Draw bonus food
    if (game.bonusFood) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(
        game.bonusFood.x * game.CELL_SIZE + game.CELL_SIZE / 2,
        game.bonusFood.y * game.CELL_SIZE + game.CELL_SIZE / 2,
        game.CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Draw snake
    game.snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = '#10b981';
        ctx.fillRect(
          segment.x * game.CELL_SIZE + 1,
          segment.y * game.CELL_SIZE + 1,
          game.CELL_SIZE - 2,
          game.CELL_SIZE - 2
        );
      } else {
        // Body
        ctx.fillStyle = index === game.snake.length - 1 ? '#34d399' : '#059669';
        ctx.fillRect(
          segment.x * game.CELL_SIZE + 2,
          segment.y * game.CELL_SIZE + 2,
          game.CELL_SIZE - 4,
          game.CELL_SIZE - 4
        );
      }
    });
  }, [game]);

  // Responsive scaling
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const newScale = Math.min(containerWidth / game.CANVAS_SIZE, 1);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [game.CANVAS_SIZE]);

  // D-pad button handler
  const handleDPadClick = (dir) => {
    game.changeDirection(dir);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* HUD */}
      <div className="w-full max-w-md mb-4 glass-panel p-4">
        <div className="flex justify-between items-center text-white">
          <div>
            <span className="text-sm text-gray-400">Score: </span>
            <span className="text-2xl font-bold text-accent-green">
              {formatNumber(game.score)}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Best: </span>
            <span className="text-xl font-semibold">{formatNumber(game.highScore)}</span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Speed: </span>
            <span className="text-lg text-accent-amber">
              {Math.round((200 - game.speed) / 10)}
            </span>
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div
        ref={containerRef}
        className="relative glass-panel-dark p-2"
        style={{
          width: '100%',
          maxWidth: `${game.CANVAS_SIZE + 16}px`,
        }}
        {...(isMobile ? controls : {})}
      >
        <canvas
          ref={game.canvasRef}
          width={game.CANVAS_SIZE}
          height={game.CANVAS_SIZE}
          className="w-full touch-none"
          style={{ imageRendering: 'pixelated' }}
          aria-label="Snake game canvas"
        />

        {/* Menus */}
        {game.gameState === GAME_STATES.START && (
          <StartMenu
            gameId={GAMES.SNAKE}
            gameName="Snake"
            description="Eat food and grow longer!"
            onStart={game.handleStart}
            onShowHelp={() => setShowHelp(true)}
          />
        )}

        {game.gameState === GAME_STATES.PAUSED && (
          <PauseMenu
            gameId={GAMES.SNAKE}
            gameName="Snake"
            onResume={game.resumeGame}
            onRestart={game.handleRestart}
            onMainMenu={() => {
              game.resetGame();
              onExit();
            }}
          />
        )}

        {game.gameState === GAME_STATES.GAME_OVER && (
          <GameOverMenu
            gameId={GAMES.SNAKE}
            gameName="Snake"
            score={game.score}
            highScore={game.highScore}
            isNewHighScore={game.score === game.highScore && game.score > 0}
            stats={{
              Length: game.snake.length,
              'Final Speed': Math.round((200 - game.speed) / 10),
            }}
            onPlayAgain={game.handleRestart}
            onMainMenu={() => {
              game.resetGame();
              onExit();
            }}
          />
        )}
      </div>

      {/* Mobile D-Pad */}
      {isMobile && game.gameState === GAME_STATES.PLAYING && (
        <div className="mt-6 glass-panel p-4">
          <div className="grid grid-cols-3 gap-2 w-48">
            <div />
            <button
              onClick={() => handleDPadClick({ x: 0, y: -1 })}
              className="btn-glass-green p-4 flex items-center justify-center"
              aria-label="Move up"
            >
              <FiArrowUp className="w-6 h-6 text-white" />
            </button>
            <div />
            <button
              onClick={() => handleDPadClick({ x: -1, y: 0 })}
              className="btn-glass-green p-4 flex items-center justify-center"
              aria-label="Move left"
            >
              <FiArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div />
            <button
              onClick={() => handleDPadClick({ x: 1, y: 0 })}
              className="btn-glass-green p-4 flex items-center justify-center"
              aria-label="Move right"
            >
              <FiArrowRight className="w-6 h-6 text-white" />
            </button>
            <div />
            <button
              onClick={() => handleDPadClick({ x: 0, y: 1 })}
              className="btn-glass-green p-4 flex items-center justify-center"
              aria-label="Move down"
            >
              <FiArrowDown className="w-6 h-6 text-white" />
            </button>
            <div />
          </div>
        </div>
      )}

      {/* How to Play Modal */}
      {showHelp && <HowToPlayModal gameId={GAMES.SNAKE} onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default Snake;
