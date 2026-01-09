import { useEffect, useRef, useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { GAMES, GAME_STATES } from '../../utils/constants';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useControls } from '../../hooks/useControls';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useBrickrush } from './useBrickrush';
import { BRICK_TYPES, POWER_UPS } from './levels';
import StartMenu from '../../components/StartMenu';
import PauseMenu from '../../components/PauseMenu';
import GameOverMenu from '../../components/GameOverMenu';
import HowToPlayModal from '../../components/HowToPlayModal';
import { formatNumber } from '../../utils/helpers';

/**
 * Brickrush Game Component
 * Classic brick breaker game with canvas rendering
 */
const Brickrush = ({ onExit }) => {
  const game = useBrickrush();
  const { isMobile } = useWindowSize();
  const [showHelp, setShowHelp] = useState(false);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Touch controls
  const controls = useControls(game.gameState === GAME_STATES.PLAYING);
  const touchXRef = useRef(null);

  // Keyboard controls
  useKeyboard(
    {
      ArrowLeft: () => {
        if (game.gameState === GAME_STATES.PLAYING) {
          game.mouseXRef.current = Math.max(0, game.mouseXRef.current - 20);
          game.movePaddle(game.mouseXRef.current);
        }
      },
      ArrowRight: () => {
        if (game.gameState === GAME_STATES.PLAYING) {
          game.mouseXRef.current = Math.min(
            game.CANVAS_WIDTH,
            game.mouseXRef.current + 20
          );
          game.movePaddle(game.mouseXRef.current);
        }
      },
      ' ': () => {
        if (game.gameState === GAME_STATES.PLAYING) {
          if (!game.balls[0]?.launched) {
            game.launchBall();
          } else {
            game.pauseGame();
          }
        }
      },
      p: () => {
        if (game.gameState === GAME_STATES.PLAYING) {
          game.pauseGame();
        }
      },
      P: () => {
        if (game.gameState === GAME_STATES.PLAYING) {
          game.pauseGame();
        }
      },
    },
    game.gameState === GAME_STATES.PLAYING
  );

  // Mouse movement
  useEffect(() => {
    const canvas = game.canvasRef.current;
    if (!canvas || isMobile) return;

    const handleMouseMove = (e) => {
      if (game.gameState !== GAME_STATES.PLAYING) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / scale) * 1;
      game.mouseXRef.current = mouseX;
      game.movePaddle(mouseX);
    };

    const handleClick = () => {
      if (game.gameState === GAME_STATES.PLAYING && !game.balls[0]?.launched) {
        game.launchBall();
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [game, isMobile, scale]);

  // Touch movement
  useEffect(() => {
    const canvas = game.canvasRef.current;
    if (!canvas || !isMobile) return;

    const handleTouchMove = (e) => {
      if (game.gameState !== GAME_STATES.PLAYING) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touchX = ((e.touches[0].clientX - rect.left) / scale) * 1;
      touchXRef.current = touchX;
      game.movePaddle(touchX);
    };

    const handleTouchStart = (e) => {
      if (game.gameState !== GAME_STATES.PLAYING) return;
      const rect = canvas.getBoundingClientRect();
      const touchX = ((e.touches[0].clientX - rect.left) / scale) * 1;
      touchXRef.current = touchX;

      // Launch ball on tap if not launched
      if (!game.balls[0]?.launched) {
        game.launchBall();
      }
    };

    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchstart', handleTouchStart);

    return () => {
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
    };
  }, [game, isMobile, scale]);

  // Game loop
  useGameLoop(game.update, game.gameState === GAME_STATES.PLAYING);

  // Render game
  useEffect(() => {
    const canvas = game.canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, game.CANVAS_WIDTH, game.CANVAS_HEIGHT);

    // Draw bricks
    game.bricks.forEach((brick) => {
      if (brick.destroyed) return;

      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

      // Border for depth
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);

      // Steel bricks have diagonal lines
      if (brick.type === BRICK_TYPES.STEEL) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(brick.x, brick.y);
        ctx.lineTo(brick.x + brick.width, brick.y + brick.height);
        ctx.moveTo(brick.x + brick.width, brick.y);
        ctx.lineTo(brick.x, brick.y + brick.height);
        ctx.stroke();
      }
    });

    // Draw power-ups
    game.powerUps.forEach((powerUp) => {
      ctx.save();
      ctx.translate(powerUp.x + 10, powerUp.y + 10);

      if (powerUp.type === POWER_UPS.MULTI_BALL) {
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('M', 0, 0);
      } else if (powerUp.type === POWER_UPS.WIDE_PADDLE) {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(-10, -5, 20, 10);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('W', 0, 0);
      }

      ctx.restore();
    });

    // Draw paddle
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(game.paddle.x, game.paddle.y, game.paddle.width, game.paddle.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(game.paddle.x, game.paddle.y, game.paddle.width, game.paddle.height);

    // Draw balls
    game.balls.forEach((ball) => {
      if (!ball) return;
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [game]);

  // Responsive scaling
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const scaleX = containerWidth / game.CANVAS_WIDTH;
      const scaleY = containerHeight / game.CANVAS_HEIGHT;
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [game.CANVAS_WIDTH, game.CANVAS_HEIGHT]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* HUD */}
      <div className="w-full max-w-4xl mb-4 glass-panel p-4">
        <div className="flex justify-between items-center text-white">
          <div>
            <span className="text-sm text-gray-400">Score: </span>
            <span className="text-xl font-bold text-accent-cyan">
              {formatNumber(game.score)}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-400">Level: </span>
            <span className="text-xl font-bold text-accent-amber">{game.level}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Lives: </span>
            {Array.from({ length: game.lives }).map((_, i) => (
              <FiHeart key={i} className="w-5 h-5 text-red-500 fill-current" />
            ))}
          </div>
          <div>
            <span className="text-sm text-gray-400">High: </span>
            <span className="text-lg font-semibold">{formatNumber(game.highScore)}</span>
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div
        ref={containerRef}
        className="relative glass-panel-dark"
        style={{
          width: '100%',
          maxWidth: `${game.CANVAS_WIDTH}px`,
          aspectRatio: `${game.CANVAS_WIDTH} / ${game.CANVAS_HEIGHT}`,
        }}
      >
        <canvas
          ref={game.canvasRef}
          width={game.CANVAS_WIDTH}
          height={game.CANVAS_HEIGHT}
          className="w-full h-full touch-none"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
          aria-label="Brickrush game canvas"
        />

        {/* Menus */}
        {game.gameState === GAME_STATES.START && (
          <StartMenu
            gameId={GAMES.BRICKRUSH}
            gameName="Brickrush"
            description="Break all the bricks to advance!"
            onStart={game.handleStart}
            onShowHelp={() => setShowHelp(true)}
          />
        )}

        {game.gameState === GAME_STATES.PAUSED && (
          <PauseMenu
            gameId={GAMES.BRICKRUSH}
            gameName="Brickrush"
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
            gameId={GAMES.BRICKRUSH}
            gameName="Brickrush"
            score={game.score}
            highScore={game.highScore}
            isNewHighScore={game.score === game.highScore && game.score > 0}
            stats={{
              'Level Reached': game.level,
              'Lives Lost': 3 - game.lives,
            }}
            onPlayAgain={game.handleRestart}
            onMainMenu={() => {
              game.resetGame();
              onExit();
            }}
          />
        )}
      </div>

      {/* How to Play Modal */}
      {showHelp && <HowToPlayModal gameId={GAMES.BRICKRUSH} onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default Brickrush;
